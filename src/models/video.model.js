import mongoose from 'mongoose'

const { Schema } = mongoose;
const videoSchema =  new Schema({
    videoFile:{
        type:String,
        required:[true], 
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0   
    },
    isPublished:{
        type:Boolean,
        default:false   
    },
    videoCloudinaryId:{
        type:String,
        required:true
    },
    thumbnailCloudinaryId:{
        type:String,
        required:true
    }
},{timestamps:true})

const Video = mongoose.model("Video",videoSchema)
export default Video;