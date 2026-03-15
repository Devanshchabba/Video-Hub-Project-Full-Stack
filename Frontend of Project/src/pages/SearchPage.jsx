import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import videoService from "../components/video.js";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await videoService.handleGetAllVideos({ query });
                console.log("Fetched videos for search query:", data);
                setVideos(data.videos || []);

            } catch (error) {
                setError("Failed to fetch videos: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchVideos();
        }
    }, [query]);

    const formatDuration = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div className="bg-black min-h-screen text-white px-6 py-8">

            {/* Heading */}
            <h1 className="text-xl mb-8">
                Search results for:
                <span className="text-gray-400 ml-2">"{query}"</span>
            </h1>

            {/* Loading */}
            {loading && (
                <p className="text-gray-400">Loading...</p>
            )}

            {/* Error */}
            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {/* No Results */}
            {!loading && videos.length === 0 && (
                <p className="text-gray-400">No videos found.</p>
            )}

            {/* Results List */}
            {videos.length > 0 && (
                <div className="space-y-8">
                    {videos.map((video) => (

                        <div
                            key={video._id}
                            className="flex flex-col sm:flex-row gap-4 group cursor-pointer"
                        >
                            {/* Thumbnail */}
                            <a href={`/video-player/${video._id}`} className="relative w-full sm:w-72 flex-shrink-0">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-44 object-cover rounded-xl"
                                />
                                <span className="absolute bottom-2 right-2 bg-black  text-white bg-opacity-80 text-xs px-2 py-1 rounded">
                                    {formatDuration(video.duration)}
                                </span>
                            </a>

                            {/* Video Info */}
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold group-hover:text-gray-300 line-clamp-2">
                                    {video.title}
                                </h2>

                                <p className="text-sm text-gray-400 mt-2">
                                    {video.channelName}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {video.views} views • {video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + ' ago' : ''}
                                </p>

                                <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                                    {video.description}
                                </p>
                            </div>
                        </div>

                    )
                    )}
                </div>
            )}
        </div>

    );
}