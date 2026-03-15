import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Playlist from "../models/playlist.model.js";
import Video from '../models/video.model.js'
import mongoose from "mongoose";
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name) {
        throw new ApiError(401, "Name of playlist is required")
    }
    if (!description) {
        throw new ApiError(401, "Description is required")
    }
    const userId = req.user._id
    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: userId
    })
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist craeted Successfully"
            )
        )
})

const addvideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId ,videoId } = req.body
    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }
    if (!playlistId) {
        throw new ApiError(400, "playlistId is required")
    }

    const userId = req.user._id;
    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId })
    console.log(playlist)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found or not owned by you")
    }
    const videos = await Video.findById(videoId)
    if (!videos) {
        throw new ApiError(404, "Video not found ")
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exist")
    }
    playlist.videos.push(videoId)
    await playlist.save({ validateBefore: false })
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist Successfully"
            )
        )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.body;
    if (!videoId) {
        throw new ApiError(401, "videoId is required")
    }
    if (!playlistId) {
        throw new ApiError(401, "playlist is required")
    }
    const userId = req.user._id
    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId })
    if (!playlist) {
        throw new ApiError(400, "PlayList not found or you does not own")
    }
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in this playlist")
    }
    await Playlist.updateOne(
        { _id: userId },
        { $pull: { videos: videoId } }
    );

    const updatedPlaylist = await Playlist.findById(playlistId).populate("videos")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatePlaylist,
                "Video removed Successfully from playlist"
            )
        )
})

const getPlaylistId = asyncHandler(async (req, res) => {
    const  playlistId  = req.params;
    // console.log("Playlist Id --->",playlistId.playlistId)
    if (!playlistId.playlistId) {
        throw new ApiError(401, "playlistId is required")
    }
    const playlist = await Playlist.findById(playlistId.playlistId).populate("videos")
    if (!playlist) {
        throw new ApiError(404, "Playlist not found ")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist
            )
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId  = req.user._id
    if(!userId){
        throw new ApiError(400,"UserId required")
    }
    const playlist = await Playlist.find({owner:userId})

    if(!playlist){
        throw new ApiError(404,"Playlist does not exist")
    }

    return  res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "User playlist Fetched Successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) {
        throw new ApiError(401, "playlistId is required")
    }
    const playlist = await Playlist.findById(playlistId);

    if (playlist.owner.toString() != req.user._id.toString()) {
        throw new ApiError(400, "You are unauthorized to delete this playlist")
    }
    await Playlist.deleteOne(playlist)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Playlist deleted Successfully"
            )
        )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.playlistId
    const { description, name } = req.body;
    const userId = req.user._id.toString()

    if (!(description || name)) {
        throw new ApiError(400, "Description or Name is required")
    }
    playlistId.toString()
    console.log("---->", playlistId, "----> ",userId)
    
    const playlist = await Playlist.findOne({ _id: playlistId , owner: userId })
    if (!playlist) {
        throw new ApiError(401, "Playlist not exist or not owned by you")
    }
    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description
    await playlist.save({ validateBefore: false })

    const updatedPlaylist = await Playlist.findById(playlistId)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    updatedPlaylist
                },
                "Playlist updated Successfully"
            )
        )
})

export { createPlaylist, addvideoToPlaylist, removeVideoFromPlaylist, getPlaylistId, deletePlaylist, updatePlaylist,getUserPlaylists }