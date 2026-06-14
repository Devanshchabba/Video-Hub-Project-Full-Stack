import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import cloudinaryUpload from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import Video from '../models/video.model.js'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import axios from 'axios'
import path from 'path'
import { attachPlaybackUrls, attachPlaybackUrlsToList, buildStreamAssetPath } from '../utils/videoPlayback.js'

const HLS_PLAYLIST_CONTENT_TYPE = 'application/vnd.apple.mpegurl';

const normalizeHlsAssetPath = (requestedPath = '/') => {
    const trimmedPath = requestedPath.replace(/^\/+/, '');
    // console.log("trimmedPath---->", trimmedPath);
    const normalizedPath = path.posix.normalize(trimmedPath || '.');

    if (normalizedPath.startsWith('..')) {
        throw new ApiError(400, "Invalid HLS asset path")
    }

    return normalizedPath === '.' ? '' : normalizedPath;
}

const rewritePlaylistUrls = (playlistContent, videoId, assetPath = '') => {
    const currentAssetDirectory = assetPath.includes('/')
        ? assetPath.slice(0, assetPath.lastIndexOf('/') + 1)
        : '';

    return playlistContent
        .split(/\r?\n/)
        .map((line) => {
            const trimmedLine = line.trim();

            if (!trimmedLine || trimmedLine.startsWith('#')) {
                return line;
            }

            try {
                new URL(trimmedLine);
                return trimmedLine;
            } catch {
                const nextAssetPath = path.posix.normalize(`${currentAssetDirectory}${trimmedLine}`);

                if (nextAssetPath.startsWith('..')) {
                    throw new ApiError(400, "Invalid HLS playlist entry")
                }

                return buildStreamAssetPath(videoId, nextAssetPath);
            }
        })
        .join('\n');
}

const proxyBinaryStream = (upstreamResponse, res) => {
    const responseHeaders = {
        'Content-Type': upstreamResponse.headers['content-type'] || 'application/octet-stream',
        'Accept-Ranges': upstreamResponse.headers['accept-ranges'] || 'bytes',
    };

    if (upstreamResponse.headers['content-length']) {
        responseHeaders['Content-Length'] = upstreamResponse.headers['content-length'];
    }
    if (upstreamResponse.headers['content-range']) {
        responseHeaders['Content-Range'] = upstreamResponse.headers['content-range'];
    }
    if (upstreamResponse.headers['cache-control']) {
        responseHeaders['Cache-Control'] = upstreamResponse.headers['cache-control'];
    }
    if (upstreamResponse.headers.etag) {
        responseHeaders.ETag = upstreamResponse.headers.etag;
    }
    if (upstreamResponse.headers['last-modified']) {
        responseHeaders['Last-Modified'] = upstreamResponse.headers['last-modified'];
    }

    res.status(upstreamResponse.status).set(responseHeaders);
    upstreamResponse.data.pipe(res);
}

const streamVideo = asyncHandler(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return res.sendStatus(405);
    }

    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const assetPath = normalizeHlsAssetPath(req.path);
    const range = req.headers.range;
    const headersToSend = range ? { Range: range } : {};

    try {
        if (!video.hlsUrl) {
            if (assetPath) {
                throw new ApiError(404, "HLS asset not found")
            }

            const fallbackResponse = await axios.get(video.videoFile, {
                responseType: 'stream',
                headers: headersToSend,
                validateStatus: (status) => status >= 200 && status < 500,
            });

            if (fallbackResponse.status >= 400) {
                return res.sendStatus(fallbackResponse.status);
            }

            proxyBinaryStream(fallbackResponse, res);
            return;
        }
        
        const sourceUrl = assetPath ? new URL(assetPath, video.hlsUrl).toString() : video.hlsUrl;
        const isPlaylistRequest = !assetPath || assetPath.endsWith('.m3u8');
        const upstreamResponse = await axios.get(sourceUrl, {
            responseType: isPlaylistRequest ? 'text' : 'stream',
            headers: isPlaylistRequest ? {} : headersToSend,
            validateStatus: (status) => status >= 200 && status < 500,
        });
        
        // console.log("assetPath--->", upstreamResponse);
        if (upstreamResponse.status >= 400) {
            return res.sendStatus(upstreamResponse.status);
        }

        if (isPlaylistRequest) {
            const rewrittenManifest = rewritePlaylistUrls(upstreamResponse.data, videoId, assetPath);

            return res
                .status(upstreamResponse.status)
                .set({
                    'Content-Type': HLS_PLAYLIST_CONTENT_TYPE,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                })
                .send(rewrittenManifest);
        }

        proxyBinaryStream(upstreamResponse, res);
    } catch (error) {
        throw new ApiError(502, "Unable to stream video", error.message || error)
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const videoOwner = video.owner.toString();
    const user = await User.findById(req.user._id)
    if (user._id != videoOwner) {
        throw new ApiError(403, 'You are not authorized to delete this video')
    }
    const videoPublicId = video.videoCloudinaryId;
    const thumbnailPublicId = video.thumbnailCloudinaryId;
    try {
        await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
        await cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: "image" });
        await Video.findByIdAndDelete(videoId);
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting the video", error)
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
    )

})
const updateVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const user = await User.findById(req.user._id)
    const userId = user._id.toString()
    const videoOwnerId = video.owner.toString()
    if (userId != videoOwnerId) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const thumbnailLocalPath = req.file?.path;

    // console.log("------> ", req.file?.path)
    if (!thumbnailLocalPath) {
        throw new ApiError(401, "ThumbnailPath is Required")
    }
    try {
        await cloudinary.uploader.destroy(video.thumbnailCloudinaryId, ({ resource_type: "image" }))
    } catch (error) {
        throw new ApiError(500, "SomeThing wen wrong during deletion of thumbnail from cloudinary", error)
    }

    const thumbnailUpload = await cloudinaryUpload(thumbnailLocalPath)
    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnail = thumbnailUpload?.secure_url;

    await video.save({
        validateBeforeSave: true
    });
    const updatedVideo = await Video.findById(video._id).populate('owner', '-password -refreshToken');

    return res.status(200).json(
        new ApiResponse(
            200,
            attachPlaybackUrls(updatedVideo, req),
            "Video updated successfully"
        )
    )
})
const uploadVideo = asyncHandler(async (req, res) => {
    //steps to publish a video
    const { title, description } = req.body;
    // console.log("Request body_----->",req.body)

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }
    // console.log("title and description--->",title,description);

    // console.log("Localpath of thumbnail", req)

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    const videoLocalPath = req.files?.video[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }
    const videoFile = await cloudinaryUpload(videoLocalPath, {
        resource_type: 'video',
        eager: [
            {
                streaming_profile: "auto",
                format: "m3u8"
            }
        ],
            eager_async: true, // use async eager processing for large files
    })
    console.log("video File --------->",videoFile);
    const thumbnail = await cloudinaryUpload(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video upload failed")
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail upload failed")
    }
    const duration = videoFile.duration;
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password -refreshToken")
    const hlsResult = Array.isArray(videoFile.eager) && videoFile.eager.length ? videoFile.eager[0] : null;
    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        duration: duration,
        title: title,
        description: description,
        owner: user,
        videoCloudinaryId: videoFile.public_id,
        thumbnailCloudinaryId: thumbnail.public_id,
        hlsUrl: hlsResult?.secure_url || null,
        hlsPublicId: videoFile?.public_id || null,
        views: 0
    });

    const uploadedVideo = await Video.findById(video._id);
    // Poll Cloudinary for the async eager result (HLS manifest) and save when ready
    (async () => {
        try {
            const publicId = videoFile.public_id;
            const maxAttempts = 20; // ~100 seconds
            let attempts = 0;
            while (attempts < maxAttempts) {
                attempts++;
                try {
                    const info = await cloudinary.api.resource(publicId, { resource_type: 'video' });
                    const eager = Array.isArray(info.eager) && info.eager.length ? info.eager[0] : null;
                    if (eager && eager.secure_url) {
                        await Video.findByIdAndUpdate(video._id, {
                            hlsUrl: eager.secure_url,
                            hlsPublicId: eager.public_id,
                        });
                        console.log(`HLS ready for video ${video._id}: ${eager.secure_url}`);
                        break;
                    }
                } catch (err) {
                    // ignore transient errors and retry
                }
                await new Promise((r) => setTimeout(r, 5000));
            }
        } catch (err) {
            console.error('Error polling for Cloudinary eager result:', err.message || err);
        }
    })();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                attachPlaybackUrls(uploadedVideo, req),
                "Video publish Successfully"
            )
        )
})


const getChannelAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;
    if (!req.params.channelId.toString()) throw new ApiError(500, "User Id required")
    const userid = req.params.channelId.toString();
    const trimmed = userid.trim(); // remove spaces 
    const userId = new mongoose.Types.ObjectId(trimmed);
    let filter = {};

    //search functionality
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // search in title
    }

    // user wants to see videos of a specific user
    if (userId) {
        filter.owner = userId
    }
    //sorting
    const sort = {}
    sort[sortBy] = sortType === "asc" ? 1 : -1

    //pagination 
    const skip = (page - 1) * limit;

    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)).populate('owner', '-password -refreshToken -email -coverImage -createdAt -updatedAt')

    const total = await Video.countDocuments(filter);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos: attachPlaybackUrlsToList(videos, req),
                    total,
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Videos fetched successfully"
            )
        )
})
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;
    let filter = {};

    //search functionality
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // search in title
    }

    // user wants to see videos of a specific user

    //sorting
    const sort = {}
    sort[sortBy] = sortType === "asc" ? 1 : -1

    //pagination 
    const skip = (page - 1) * limit;

    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)).populate('owner', '-password -refreshToken -email -coverImage -createdAt -updatedAt')

    const total = await Video.countDocuments(filter);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos: attachPlaybackUrlsToList(videos, req),
                    total,
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Videos fetched successfully"
            )
        )
})


const getVideoId = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }
    const video = await Video.findById(videoId).populate('owner', '-password -refreshToken')
    // console.log("video---->", video)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    video.views += 1;
    await video.save({ validateBeforeSave: true });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                attachPlaybackUrls(video, req),
                "Video fetched successfully"
            )
        )
})


const toggleVideoPublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }
    // console.log("----->", req.user._id)
    const user = await User.findById(req.user._id)
    const userId = user._id.toString();
    const videoOwnerId = video.owner.toString();
    if (userId != videoOwnerId) {
        throw new ApiError(403, "You are not authorized to toggle the publish status of this video")
    }
    const checkPublish = video.isPublished;
    video.isPublished = !checkPublish
    await video.save({ validateBeforeSave: true })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isPublished: video.isPublished
                },
                "Video publish toggle successful"
            )
        )
})




export { uploadVideo, getVideoId, streamVideo, deleteVideo, updateVideo, toggleVideoPublishStatus, getAllVideos, getChannelAllVideos }
