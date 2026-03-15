
import { toggleVideoLike,toggleCommentLike,toggleTweetLike,getCommentLikes,getTweetLikes,getVideoLikes } from "../controllers/likes.controller.js";
import {Router} from 'express'
import { jwtVerify } from "../middlewares/auth.middleWare.js";

const router = Router();

router.route('/toggle-video-like/:videoId').post(jwtVerify,toggleVideoLike);
router.route('/toggle-tweet-like/:tweetId').post(jwtVerify,toggleTweetLike);
router.route('/toggle-comment-like/:commentId').post(jwtVerify,toggleCommentLike);

router.route('/get-video-likes/:videoId').get(jwtVerify,getVideoLikes);
router.route('/get-tweet-likes/:tweetId').get(jwtVerify,getTweetLikes);
router.route('/get-comment-likes/:commentId').get(jwtVerify,getCommentLikes);


export default router;