import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from '../models/tweets.model.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id;
    if (!content) {
        throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.create({
        owner: userId,
        content: content
    })
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                tweet
            )
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const tweetId = req.params.tweetId;
    const userId = req.user._id.toString();

    if (!content) {
        throw new ApiError(400, "Content is required");
    }
    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required");
    }
    const tweet = await Tweet.findById(tweetId);
    const tweetOwner = tweet.owner.toString();
    // console.log("---->",tweetOwner,"--->",userId)
    if (tweetOwner != userId) {
        throw new ApiError(403, "You are not authorized to update tweet")
    }
    tweet.content = content;
    tweet.save({ validateBefore: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet updated Successfully"
            )
        )
})

const getTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required")
    }
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet fetched Successfully"
            )
        )
})
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id.toString();
    if (!tweetId) {
        throw new ApiError(400, "tweetId is required")
    }
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    const tweetOwner = tweet.owner.toString();
    if (userId !== tweetOwner) {
        throw new ApiError(400, "You are not authorized to delete this tweet")
    }
    await tweet.deleteOne({_id:tweetId})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Tweet deleted Successfully"
            )
        )
})

const getUserTweet = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;

    const userid = req.user._id.toString();
    const userId = new mongoose.Types.ObjectId(userid)
    let filter = {}
    if(userId){
        filter.owner = userId
    }
    if(query){
        filter.title = {$regex:query, $options:"i"}
    }

    const sort ={};
    sort[sortBy] = sortType === "asc" ? 1 : -1

    const skip =  (page-1)*limit

    const tweet = await Tweet.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate('owner' , '-password -refreshToken -email -coverImage -createdAt -updatedAt')

    const total = await Tweet.countDocuments(filter);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                tweet,
                total,
                currentPage : Number(page),
                totalPages: Math.ceil(total/limit)
            },
            "Tweets fetched Successfully"
        )
    )
})

export { createTweet, updateTweet, getTweet, deleteTweet,getUserTweet }