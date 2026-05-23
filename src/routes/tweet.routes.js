import { Router } from "express";

import { jwtVerify } from "../middlewares/auth.middleWare.js";
import { upload } from "../middlewares/multer.middleWare.js";
import { createTweet, deleteTweet, getTweet, getUserTweet, updateTweet,getAllTweets } from "../controllers/tweet.controller.js";


const router = Router();

router.route("/create-tweet").post(jwtVerify, upload.array("images", 10), createTweet)
router.route("/update-tweet/:tweetId").patch(jwtVerify, upload.array("images", 10), updateTweet)
router.route("/delete-tweet/:tweetId").delete(jwtVerify,deleteTweet)
router.route("/get-tweets").get(jwtVerify,getUserTweet)
router.route("/get-all-tweets").get(jwtVerify,getAllTweets);
export default router;