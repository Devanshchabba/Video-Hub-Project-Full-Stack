import { Router } from "express";

import { jwtVerify } from "../middlewares/auth.middleWare.js";
import { createTweet, deleteTweet, getTweet, getUserTweet, updateTweet } from "../controllers/tweet.controller.js";


const router = Router();

router.route("/create-tweet").post(jwtVerify,createTweet)
router.route("/update-tweet/:tweetId").patch(jwtVerify,updateTweet)
router.route("/delete-tweet/:tweetId").delete(jwtVerify,deleteTweet)
router.route("/get-tweets").get(jwtVerify,getUserTweet)

export default router;