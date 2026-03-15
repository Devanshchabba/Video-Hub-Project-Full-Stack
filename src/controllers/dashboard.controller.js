import mongoose from "mongoose";
import { Like } from "../models/likes.model.js";
import Video from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Subscription from "../models/subscription.model.js";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;
    if (!channelId) {
        throw new ApiResponse(400, "channelId is required")
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }
    const videos = await Video.find({ owner: channelId }).select("id views").lean()

    const totalVideos = videos.length
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0)
    const videoId = videos.map((v) => v._id)
    const totalLikes = await Like.countDocuments({ video: { $in: videoId } })


    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })
    const stats = {
        totalVideos,
        totalViews,
        totalLikes,
        totalSubscribers
    }
    console.log(stats)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel stats fetched Successfully"
            )
        )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.params;
    console.log("---->", channelId)
    if (!channelId) {
        throw new ApiError(400, "chennelId is required")
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }
    const videos = await Video.find({ owner: channelId })
    const videoCount = videos.length;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos,
                    videoCount
                },
                "Channel Videos Fetched Successfully"
            )
        )
})

export { getChannelVideos, getChannelStats }