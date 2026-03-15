import {Router} from 'express'
import {getSubscribedCount, getUserChannelSubscribers, toggleSubscribe,subscribersCount,isSubscribed} from '../controllers/subscription.controller.js'
import { jwtVerify } from '../middlewares/auth.middleWare.js'

const router = Router()

router.route('/toggle-subscribe/:channelId').post(jwtVerify,toggleSubscribe)
router.route('/is-subscribed/:channelId').get(jwtVerify,isSubscribed)

router.route('/user-subscribers/:channelId').get(jwtVerify,getUserChannelSubscribers)

router.route('/get-subscribedto/:subscriberId').get(jwtVerify,getSubscribedCount)
router.route('/user-subscribers-count/:channelId').get(jwtVerify,subscribersCount)

export default router