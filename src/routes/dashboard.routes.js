import {Router} from 'express'
import { getChannelStats,getChannelVideos } from '../controllers/dashboard.controller.js'
import { jwtVerify } from '../middlewares/auth.middleWare.js'
const router = Router()

router.route('/get-channel-videos/:channelId').get(jwtVerify,getChannelVideos)

router.route('/get-channel-stats/:channelId').get(jwtVerify,getChannelStats)

export default router
