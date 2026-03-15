import {Router} from 'express'
import {jwtVerify} from '../middlewares/auth.middleWare.js'
import { createPlaylist,addvideoToPlaylist,removeVideoFromPlaylist, getPlaylistId, deletePlaylist, updatePlaylist, getUserPlaylists } from '../controllers/playlist.controller.js'

const router = Router()

router.route('/create-playlist').post(jwtVerify,createPlaylist)
router.route('/add-video').post(jwtVerify,addvideoToPlaylist)

router.route('/remove-video').delete(jwtVerify,removeVideoFromPlaylist)
router.route('/get-playlist/:playlistId').get(jwtVerify,getPlaylistId)

router.route('/delete-playlist/:playlistId').delete(jwtVerify,deletePlaylist)

router.route('/update-playlist/:playlistId').patch(jwtVerify,updatePlaylist)

router.route('/get-user-playlists').get(jwtVerify,getUserPlaylists)
export default router