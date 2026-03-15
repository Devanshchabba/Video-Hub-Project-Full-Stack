import { asyncHandler } from "../utils/asyncHandler.js";
import Comment from '../models/comments.model.js'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {User} from '../models/user.model.js'

const getVideoComments  = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query
    if(!videoId){
        throw new ApiError(400,"videoId is required")
    }
    const skip = (page-1)*limit;
    console.log("------>",videoId)
    
    const comments  = await Comment.find({video:videoId}).skip(skip).limit(Number(limit))
    if(!comments){
        throw new ApiError(404,"No comments found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "Comments fetched Successfully"
        )
    )
})


const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const videoId  = req.params.videoId;
    if (!content || !videoId) {
        throw new ApiError(400, "Content and videoId are required")
    }
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password -refreshToken")
    console.log("---->",videoId)
    const comment = await Comment.create({
        owner: userId,
        content: content,
        video: videoId,
        user:user
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {comment},
                "Comment added Successfully"
            )
        )
})
const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId
    const {changeContent } = req.body;
    if (!commentId) {
        throw new ApiError(400, "commentId is required")
    }
    const userId = req.user._id;
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    comment.content = changeContent;
    await comment.save({ validateBeforeSave: false })
    const updatedComment = await Comment.findById(comment._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedComment,
                "Comment updated Successfully"
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "commentId is required")
    }
    const userId = req.user._id;
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }
    await comment.deleteOne({_id:commentId});
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Comment deleted Successfully"
            )
        )
})



export { addComment, updateComment, deleteComment ,getVideoComments}