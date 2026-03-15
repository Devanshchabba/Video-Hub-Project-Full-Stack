import express from 'express'
import {changeCoverImage,changePassword,
    loginUser,logOutUser, refreshAccessToken,
    registerUser,updateAccountDetails,changeAvatar,
    getUserChannelProfile,getWatchHistory,
    getUserProfile
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleWare.js'
import { jwtVerify } from '../middlewares/auth.middleWare.js';
const router = express.Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

router.route("/logout").post(
    jwtVerify, logOutUser
)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(jwtVerify, changePassword)
router.route("/change-userData").patch(jwtVerify, updateAccountDetails)
router.route("/get-user-profile").get(jwtVerify,getUserProfile)
router.route("/change-avatar").patch(
    jwtVerify,
    upload.single("avatar"),
    changeAvatar
)
router.route("/change-coverImage").patch(
    jwtVerify,
    upload.single("coverImage"),
    changeCoverImage
)
router.route("/user-channel/:userName").get(
    jwtVerify,
    getUserChannelProfile
)
router.route("/watchHistory").get(
    jwtVerify,
    getWatchHistory
)

// router.post('/register', registerUser); 
export default router