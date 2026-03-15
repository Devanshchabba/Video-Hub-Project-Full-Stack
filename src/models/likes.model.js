import { mongoose, Schema } from "mongoose"

const likeSchema = new Schema({
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: 'Video'
    },
    tweet: {
        type: mongoose.Types.ObjectId,
        ref: 'Tweet'
    },
    comment: {
        type: mongoose.Types.ObjectId,
        ref : 'Comment'
    }
}, { timestamps: true })

const Like = mongoose.model("Like",likeSchema)
export  {Like}