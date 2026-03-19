import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import videoService from "../components/video.js";
import playlistService from "../components/playlist.js";

export default function SearchOverlay({ playlistId, onClose }) {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔎 Fetch search results
    useEffect(() => {
        const fetchVideos = async () => {
            if (query.trim().length < 2) {
                setVideos([]);
                return;
            }
            
            try {
                setLoading(true);
                const data = await videoService.handleGetAllVideos({ query });
                setVideos(data.videos || []);
                console.log("Videos ", data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchVideos, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleAddVideo = async (videoId) => {
        try {
            await playlistService.addVideo({playlistId,videoId});
            onClose(); // 🔥 close after adding
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Dark Background */}
            <div
                className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">
                        Add Video to Playlist
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-white" />
                    </button>
                </div>

                {/* Search Input */}
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none mb-4"
                />

                {/* Results */}
                {loading && (
                    <p className="text-gray-400">Searching...</p>
                )}

                {!loading && videos.length === 0 && query.length >= 2 && (
                    <p className="text-gray-400">No results found</p>
                )}
                {videos.length > 0 && query.length > 2 && (
                    <div className="space-y-3">
                        {videos.map((video) => (
                            <div
                                key={video._id}
                                className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-zinc-800"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-16 h-10 object-cover rounded"
                                    />
                                    <div>
                                        <p className="text-sm text-white">
                                            {video.title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {video.channelName}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddVideo(video._id)}
                                    className="p-2 rounded-full bg-green-600 hover:bg-green-500 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}