import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Subscription from '../models/subscription.model.js'
import mongoose from "mongoose";

const toggleSubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "Channel is required")
    }
    const userId = req.user._id.toString();
    console.log(channelId, "---->", userId)
    const existingSubscriber = await Subscription.findOne({ channel: channelId, subscriber: userId })
    let isSubscribed;
    let subscribe
    if (existingSubscriber) {
        await Subscription.deleteOne({ channel: channelId, subscriber: userId })
        isSubscribed = false;
    }
    else {
        subscribe = await Subscription.create({
            channel: channelId,
            subscriber: userId
        })
        isSubscribed = true;
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isSubscribed,
                    subscribe
                },
                "Subscribe toggled successfully"
            )
        )
})

const isSubscribed = asyncHandler(async (req, res) => {
    console.log("HIT isSubscribed ->", JSON.stringify(req.params));
    let { channelId } = req.params;
    console.log("--->channelId", channelId)

    channelId = channelId.trim();

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid Channel ID");
    }
    if (!channelId) {
        throw new ApiError(400, "Channel ID is Required")
    }
    const userId = req.user._id.toString();
    const existingSubscriber = await Subscription.findOne({ channel: channelId, subscriber: userId })
    let isSubscribed;
    if (existingSubscriber) {
        isSubscribed = true;
    }
    else {
        isSubscribed = false;
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                isSubscribed,
                "Is Subscribed Fetched Successfully"
            )
        )


})
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // channelId.toString()
    if (!channelId) {
        throw new ApiError(400, "channelId is required")
    }
    const subscriber = await Subscription.find({ channel: channelId }).populate("subscriber", "userName email")

    if (!subscriber || subscriber.length === 0) {
        throw new ApiError(404, "Account does not have any subscribers");
    }
    const len = subscriber.length
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    subscriber,
                    len
                },
                "Subscriber fetched Successfully"
            )
        )
})

const subscribersCount = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    console.log("---->channelId:", channelId)

    if (!channelId) {
        throw new ApiError(400, "channelId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    const len = await Subscription.countDocuments({ channel: channelId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                len,
                "Subscriber Count fetched Successfully"
            )
        );
});
const getSubscribedCount = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(
            400, "subscriberId is required"
        )
    }
    const channel = await Subscription.find({ subscriber: subscriberId })
    // if(channel.length==0 || !channel){
    //     throw new ApiError(404,"Channels not found ")
    // }
    const lengthChannel = channel.length

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    channel
                    , lengthChannel
                },
                "SubcribedTo fetched Successfully"

            )
        )

})

export { toggleSubscribe, getSubscribedCount, getUserChannelSubscribers, subscribersCount, isSubscribed }