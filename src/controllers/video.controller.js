import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import cloudinaryUpload from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import Video from '../models/video.model.js'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

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
    const videoFile = await cloudinaryUpload(videoLocalPath)
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
    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        duration: duration,
        title: title,
        description: description,
        owner: user,
        videoCloudinaryId: videoFile.public_id,
        thumbnailCloudinaryId: thumbnail.public_id,
        views: 0
    });

    const uploadedVideo = await Video.findById(video._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                uploadedVideo,
                "Video publish Successfully"
            )
        )
})
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
            updatedVideo,
            "Video updated successfully"
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
                    videos,
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
                    videos,
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
    video.views += 1;
    await video.save({ validateBeforeSave: true });
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
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




export { uploadVideo, getVideoId, deleteVideo, updateVideo, toggleVideoPublishStatus, getAllVideos, getChannelAllVideos }
