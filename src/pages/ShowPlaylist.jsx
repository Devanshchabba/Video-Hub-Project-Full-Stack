import { MoreVertical, Play, Plus, Pencil } from "lucide-react";
import { useState, useEffect } from 'react';
import playlistService from "../components/playlist";
import { useParams } from "react-router-dom";
import SearchOverlay from "./PlaylistSearchBox.jsx"
import { formatDistanceToNow } from "date-fns";

export default function PlaylistVideos() {

    // const playlist = {
    //     name: "Classical_Devansh",
    //     thumbnail: "", // optional
    //     ownerName: "Devansh Chabba",
    //     videos: [
    //         {
    //             _id: "1",
    //             title: "Dekha Ek Khwab",
    //             thumbnail: "...",
    //             duration: "5:21",
    //             channelName: "Lata Mangeshkar",
    //             views: "5.9M",
    //             uploadedAt: "6 years ago"
    //         }
    //     ]
    // }
    const playlistId = useParams()
    const [playlist, setPlaylist] = useState({})

    const fetchPlaylist = async () => {
        try {
            const res = await playlistService.getPlaylistById(playlistId.playlistId);
            setPlaylist(res.videos);
            console.log("Playlist---->", res);
        } catch (error) {
            console.error("Error in fetching Platylist by Id ", error)
        }
    }

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId.playlistId])

    const [showOverlay, setShowOverlay] = useState(false)


    const videos = playlist?.videos || [];


    // 🔥 Fallback Thumbnail Logic
    const playlistThumbnail =
        playlist?.thumbnail || playlist[0]?.thumbnail || "";


    const formatDuration = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div className="bg-black min-h-screen text-white px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-10">

                {/* ================= LEFT SIDE - VIDEO LIST ================= */}
                <div className="flex-1">

                    {/* Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold">
                            {playlist?.name}
                        </h1>

                        <select className="bg-zinc-800 text-sm px-3 py-1 rounded-md border border-zinc-700">
                            <option>Manual</option>
                            <option>Date added</option>
                            <option>Most popular</option>
                        </select>
                    </div>

                    {/* Video List */}
                    {playlist.length > 0 && (<div className="space-y-6">
                        {playlist.map((video, index) => (
                            <div
                                key={video._id}
                                className="flex gap-4 items-start group"
                            >
                                {/* Index */}
                                <div className="text-gray-400 w-6 text-right mt-6">
                                    {index + 1}
                                </div>

                                {/* Thumbnail */}
                                <a href={`video-player/${video._id}`} className="relative w-48 flex-shrink-0">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="rounded-lg w-full h-28 object-cover"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-xs px-2 py-0.5 rounded">
                                        {formatDuration(video.duration)}
                                    </span>
                                </a>

                                {/* Info */}
                                <div className="flex-1">
                                    <a href={`video-player/${video._id}`} className="text-md font-semibold line-clamp-2 group-hover:text-gray-300">
                                        {video.title}
                                    </a>

                                    <p className="text-sm dark:text-gray-100 text-gray-400 mt-1">
                                        {video.owner.fullName}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {video.views} views • {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
                                    </p>
                                </div>

                                <button className="text-gray-400 hover:text-white">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        ))}
                    </div>) || (
                            <p className="text-gray-400">No videos in this playlist. Start adding some!</p>
                        )}
                </div>

                {/* ================= RIGHT SIDE - PLAYLIST CARD ================= */}
                <div className="w-full lg:w-80 flex-shrink-0 mt-10">

                    <div className="bg-gradient-to-b from-green-800 to-green-950 p-6 rounded-2xl shadow-xl">

                        {/* Playlist Thumbnail */}
                        <img
                            src={playlistThumbnail}
                            alt="Playlist Thumbnail"
                            className="w-full h-56 object-cover rounded-xl shadow-md"
                        />

                        {/* Playlist Info */}
                        <div className="mt-5">
                            <h2 className="text-2xl font-bold">
                                {playlist?.name}
                            </h2>

                            <p className="text-sm text-gray-300 mt-2">
                                {playlist?.ownerName}
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                                {videos.length} videos
                            </p>

                            {/* Play Button */}
                            <button className="mt-5 w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-full font-semibold hover:scale-105 transition">
                                <Play size={18} />
                                Play all
                            </button>

                            <div className="mt-5 flex gap-4 justify-center" >
                                <button onClick={() => setShowOverlay(true)} className="p-3 rounded-full bg-green-700 hover:bg-green-600 transition">
                                    <Plus size={18} />
                                </button>
                                {showOverlay && (
                                    <SearchOverlay
                                        playlistId={playlistId.playlistId}
                                        onClose={() => setShowOverlay(false)}
                                    />
                                )}

                                {/* Edit Playlist */}
                                <button className="p-3 rounded-full bg-green-700 hover:bg-green-600 transition">
                                    <Pencil size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}