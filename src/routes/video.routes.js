import { Router } from "express";
import {uploadVideo ,getVideoId,deleteVideo,updateVideo,toggleVideoPublishStatus,getAllVideos,getChannelAllVideos} from '../controllers/video.controller.js'
import {upload} from '../middlewares/multer.middleWare.js'
import { jwtVerify } from "../middlewares/auth.middleWare.js";
const router = Router()

router.route('/upload').post(jwtVerify,
    upload.fields([
        { name: "video", maxCount:1},
        { name: "thumbnail", maxCount:1}
    ]), uploadVideo)
router.route('/video/:videoId').get(jwtVerify,getVideoId)
router.route('/delete-video/:videoId').delete(jwtVerify,deleteVideo)
router.route('/update-video/:videoId').patch(jwtVerify,
    upload.single("thumbnail"),updateVideo
)
router.route('/toggle-publish/:videoId').patch(jwtVerify,toggleVideoPublishStatus)
router.route('/').get(jwtVerify,getAllVideos)
router.route('/get-channel-videos/:channelId').get(jwtVerify,getChannelAllVideos)
export default router;