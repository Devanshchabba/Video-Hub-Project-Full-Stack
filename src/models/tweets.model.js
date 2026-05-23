import { mongoose, Schema } from "mongoose";

const tweetSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }]


}, { timestamps: true })

const Tweet = mongoose.model("Tweet",tweetSchema)
export  {Tweet};