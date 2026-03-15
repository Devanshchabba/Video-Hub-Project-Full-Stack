import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js  '
import cloudinaryUpload from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";


const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, userName, password } = req.body;
    // console.log(req.body)

    // if(fullName==""){
    //     throw new ApiError(400,'fullName is required')
    // }  // can also check by if else but need multiple if else to check the validations of user credentials 
    // we will use the array 
    if (
        [fullName, email, userName, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    } // can add more validation in the code example : email should have @ sign 

    //checking user exist ?
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    // console.log("If user exist or not ?  : ", existedUser)
    if (existedUser) {
        throw new ApiError(409, "User with Email or userName already exist")
    }
    console.log("Avatar : ", req.files.avatar[0].path)

    const avatarLocalPath = await req.files?.avatar[0]?.path;
    // const coverImageLocalPath = await req.files?.coverImage[0]?.path;

    let coverImageLocalPath = "";
    // if (req.files && Array.isArray(req.files.CoverImage) && coverImage.length > 0) {
    if (req.files?.coverImage?.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }
    console.log("CoverImage local path --- >", coverImageLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    const avatar = await cloudinaryUpload(avatarLocalPath)
    const coverImage = await cloudinaryUpload(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    // console.log(createdUser)
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})
const generateAccessTokenRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();


        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong during refresh and access token generation ")
    }
}
const loginUser = asyncHandler(async (req, res) => {

    // 1. get detail like email and userName 
    // 2. get data from req.body  
    // 3. check validations  - not empty, not registered user
    // 4. check user already registered -find user data 
    // 5. check password
    // 6. generate access and refresh token
    // 7. send cookies

    const { indentifier, password } = req.body;

    if (!indentifier) {
        throw new ApiError(400, "UserName or Email is required")
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const normalizedIndentifier = indentifier?.toLowerCase();
    // const normalizedUserName = userName?.toLowerCase();


    const user = await User.findOne({
        $or: [{ userName: normalizedIndentifier },
        { email: normalizedIndentifier },]
    })
    // console.log("UserName ---- >",userName)
    // const user = await User.findOne({userName:normalizedUserName})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    //password check 
    const passwordCheck = await user.isPasswordMatch(password)


    if (!passwordCheck) {
        throw new ApiError(401, "Invalid User Credentials")
    }
    const userId = user._id
    const { refreshToken, accessToken } = await generateAccessTokenRefreshToken(userId)

    // user.refreshToken(refreshToken) // if not running properly i can also call the user.body again as done above
    const options = {  // only server can modify cookies also known secure cookies
        httpOnly: true,
        secure: true
    }
    // user.password = undefined;
    // user.refreshToken = undefined;

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // important to add await during calling database


    const safeUser = {
        _id: loggedInUser._id,
        email: loggedInUser.email,
        username: loggedInUser.username,
    };
    // console.log("ID is  :: => ", loggedInUser._id)

    return res.status(200)  // giving the response of the request of the /login route 
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: safeUser,
                    accessToken,
                    refreshToken
                },
                "User logged in Successfully"
            )
        );
})

const logOutUser = asyncHandler(async (req, res) => {
    // remove the refresh and access tokens the user will be logged out
    const userId = req.user?._id;
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined,
                accessToken: undefined
            }
        },
        {
            new: true
        }
    )
    const option = {  // only server can modify cookies also known secure cookies
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(200, {}, "User Logged Out Successfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "No refresh token provided");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } =
        await generateAccessTokenRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { accessToken, refreshToken }, "Access token Refreshed Successfully")
        );
});

const changePassword = asyncHandler(async (req, res) => {
    // 1. get the user from the request
    // 2. get the new password from the request
    // 3. validate the new password - length, complexity
    // 4. update the password in the database
    // 5. send the updated user to the client
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword || newPassword)) {
        throw new ApiError(400, "Old Password and New Password are required")
    }
    const user = await User.findById(req.user?._id)
    // console.log("User ===> ", user)

    const isPasswordCorrect = await user.isPasswordMatch(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password ")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        )
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }
    const existingUserWithNewEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user?._id }
    });

    if (existingUserWithNewEmail) {
        throw new ApiError(409, "Email already in use by another user")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            fullName,
            email
        },
        {
            new: true
        }
    ).select("-password")
    return res.status(200)
        .json(new ApiResponse(
            200,
            user,
            "Full name and Email Updated Successfully"
        ))
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")
    return res.status(200)
        .json(new ApiResponse(
            200,
            user,
            "User Fetched Successfully"
        ))
})

const changeAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    const avatar = await cloudinaryUpload(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error during uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(new ApiError(
            200,
            user,
            "Avatar Changed Successfully"
        ))
})

const changeCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is required")
    }
    const coverImage = await cloudinaryUpload(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error during uploading Cocer Image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(new ApiError(
            200,
            user,
            "Cover Image Changed Successfully"
        ))
})
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params
    if (!userName) {
        throw new ApiError(400, "UserName is required")
    }
    const channel = await User.aggregate([   // i forgot to add await 
        {
            $match: { userName: userName?.toLowerCase() },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" },
                subscribedToCount: { $size: "$subscribedTo" },

                isSubcribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false // will see later again 
                    }
                }
            },
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                avatar: 1,
                email: 1,
                coverImage: 1,
                subscriberCount: 1,
                subscribedToCount: 1,
                isSubcribed: 1
            }
        }
    ])
    console.log("Channel : ", channel)
    if (!channel?.length) {
        throw new ApiError(400, "Channel does not exist")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "Channel Fetched Successfully")
        )
})

const getWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",

                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    },
                    {
                        $project: {
                            "owner.fullName": 1,
                            "owner.avatar": 1,
                            "owner.userName": 1,
                            title: 1,
                            description: 1
                        }
                    },

                    // {
                    //     $project: {
                    //         "owner.fullName": 1,
                    //         "owner.avatar": 1,
                    //         "owner.userName": 1,
                    //         title: 1,
                    //         description: 1
                    //     }
                    // }
                ]
            }
        }
    ])
    console.log(user.watchHistory)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch History fetched Succesfully"
            )
        )
})


export {
    registerUser, loginUser, logOutUser, refreshAccessToken,
    changePassword, changeCoverImage, changeAvatar, updateAccountDetails,
    getUserProfile, getUserChannelProfile, getWatchHistory
};