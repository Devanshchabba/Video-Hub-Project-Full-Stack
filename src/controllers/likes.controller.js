import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from '../models/likes.model.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({ video: videoId, likedBy: userId })
    let like = null;
    let isLiked;
    if (existingLike) {
        like = await Like.findByIdAndDelete(existingLike._id)
        isLiked = false
    }
    else {
        like = await Like.create({ video: videoId, likedBy: userId })
        isLiked = true;
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                isLiked,
                like
            },
            "Video like toggled Successfully"
        ))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId) {
        throw new ApiError(400, "tweetId is required")
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId })

    let like;
    let isLiked;
    if (existingLike) {
        like = await Like.findByIdAndDelete(existingLike._id)
        isLiked = false;
    }
    else {
        like = await Like.create({ tweet: tweetId, likedBy: userId })
        isLiked = true;
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                isLiked,
                like
            },
            "Tweet Like toggled Successfully"
        ))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "commentId is required")
    }
    const userId = req.user._id
    let like;
    let isLiked;
    const existingLike = await Like.findOne({ likedBy: userId, comment: commentId })

    if (existingLike) {
        like = await Like.findByIdAndDelete(existingLike._id);
        isLiked = false
    }
    else {
        like = await Like.create({ likedBy: userId, comment: commentId })
        isLiked = true
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isLiked,
                    like
                },
                "Tweet like Toggled Successfully"
            )
        )
})

const getVideoLikes = asyncHandler(async (req,res) =>{
    const videoId = req.params.videoId;
    if(!videoId){
        throw new ApiError(400,"VideoId is required");
    }
    const likes = await Like.find({video:videoId}).populate('likedBy','userName email');
    const len = likes.length;
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {likes,len},
            "Video Likes fetched Successfully"
        )
    )
})

const getCommentLikes = asyncHandler(async (req,res) =>{
    const commentId = req.params.commentId;
    if(!commentId){
        throw new ApiError(400,"CommentId is required");
    }
    const likes = await Like.find({comment:commentId}).populate('likedBy','userName email');
    const len = likes.length;
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {likes,len},
            "Comment Likes fetched Successfully"
        )
    )
})

const getTweetLikes = asyncHandler(async (req,res) =>{
    const tweetId = req.params.tweetId;
    if(!tweetId){
        throw new ApiError(400,"TweetId is required");
    }
    const likes = await Like.find({tweet:tweetId}).populate('likedBy','userName email');
    const len = likes.length;
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {likes,len},
            "Tweet Likes fetched Successfully"
        )
    )
})



const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})


export { toggleVideoLike, toggleTweetLike ,toggleCommentLike,getVideoLikes,getCommentLikes,getTweetLikes}