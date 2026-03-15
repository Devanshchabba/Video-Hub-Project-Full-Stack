import {Router} from 'express'
import { addComment, deleteComment, updateComment,getVideoComments } from '../controllers/comment.controller.js'
import { jwtVerify } from '../middlewares/auth.middleWare.js'
const router = Router()


router.post('/add-comment/:videoId',jwtVerify,addComment)
router.patch('/update-comment/:commentId',jwtVerify,updateComment)
router.delete('/delete-comment/:commentId',jwtVerify,deleteComment)

router.get('/all-comments/:videoId',jwtVerify,getVideoComments)

export default router