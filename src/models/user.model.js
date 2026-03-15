import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;
const userSchema =  new Schema({
    userName:{
        type:String,
        required:[true, "Name is required"],
        trim:true,
        unique:true,
        index:true,
        lowercase:true,
        index:true,
        minlength:[3, "Name must be at least 3 characters long"],
        maxlength:[50, "Name must be at most 50 characters long"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Email is required'],
        trim:true,
        lowercase:true,
    },
    password:{
        type:String, // challenge need to encrypt before storing to the database
        rquired:[true,'Password is rquired'],
    },
    fullName:{
        type:String,
        required:[true,'Full name is required'],
        trim:true,
        index:true,

    },
    avatar:{
        type:String, // cloudinary url
        required:true,
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type : Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10)
}) 

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id :this._id,
            userName:this.userName,
            fullName:this.fullName,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
        return jwt.sign(
        {
            _id :this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User',userSchema)
export  {User};