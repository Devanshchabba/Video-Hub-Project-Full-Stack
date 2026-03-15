import {Schema, mongoose} from 'mongoose'

const playListSchema = new Schema ({
    name:{
        type:String,
        required:true,   
    },
    description:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
    },
    videos:[{
        type:mongoose.Types.ObjectId,
        ref: 'Video'
    }],
    
},{timestamps:true})

const Playlist = mongoose.model("Playlist",playListSchema)
export default Playlist