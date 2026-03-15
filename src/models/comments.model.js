import {Schema, mongoose} from 'mongoose'

const commentSchema = new Schema({
    owner:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        required:true
    },
    video:{
        type:mongoose.Types.ObjectId,
        ref:'Video'
    },
    user:{
        type:Object,
        required:true
    }
},{timestamps:true})


const Comment =  mongoose.model("Comment",commentSchema)
export default Comment