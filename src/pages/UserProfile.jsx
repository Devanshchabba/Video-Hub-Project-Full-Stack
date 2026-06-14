import { ChannelHeader, ChannelVideos } from "./index.jsx";
import authService from "../components/user.js";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import videoService from "../components/video.js"
import subscriptionService from "../components/subscription.js"
function ChannelPage() {


    const [user, setUser] = useState({})
    const [video, setVideo] = useState({
        currentPage: 1,
        total: 0,
        totalPages: 0,
        videos: []
    })
    const [subscribers, setSubscribers] = useState(0)

    const userName = useParams();

    const handleUserProfile = useCallback(async () => {
        try {
            const response = await authService.getChannelProfile(userName.userName);
            // console.log("User Profile --->", response);
            setUser(response);
        } catch (error) {
            console.error("Error fetching user profile", error)
        }
    }, [userName.userName]);

    const handleChannelVideoFetch = useCallback(async () => {
        try {
            const response = await videoService.getChannelVideos(user._id);
            console.log("Channel video --->", response);
            if (response) {
                setVideo(response);

            }
        } catch (error) {
            console.error("Error in fetching videos :", error)
        }
    }, [user._id]);

    const navigate = useNavigate();
    const location = useLocation();
    const [videoToDelete, setVideoToDelete] = useState(null);

    const openDeleteDialog = useCallback((video) => {
        if (!video?._id) return;
        setVideoToDelete(video);

    }, []);

    const cancelDelete = useCallback(() => {

        setVideoToDelete(null);
    }, []);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const confirmDelete = useCallback(async () => {
        console.log("videoToDelete ----> ", videoToDelete);
        if (!videoToDelete?._id) return;

        try {
            setDeleteLoading(true);
            await videoService.deleteVideo(videoToDelete._id);
            setDeleteLoading(false);
            setDeleteSuccess("Video deleted successfully!");
            setTimeout(() => {
                setDeleteSuccess(null);
            }, 5000);
            setVideo((prev) => ({
                ...prev,
                videos: prev.videos.filter((item) => item._id !== videoToDelete._id),
                total: Math.max(0, (prev.total || 1) - 1),
            }));
            setVideoToDelete(null);
        } catch (error) {
            console.error('Error deleting video:', error);
            window.alert('Unable to delete video. Please try again.');
        }
    }, [videoToDelete]);

    const handleEditVideo = useCallback((video) => {
        if (!video?._id) return;
        navigate(`/upload-video/${video._id}`, { state: { from: location.pathname } });
    }, [location.pathname, navigate]);

    const handleSubscriberFetch = useCallback(async () => {
        try {
            // console.log("User Id is ---> ", user._id)
            const res = await subscriptionService.handleUserSubscribers(user._id);
            setSubscribers(res ?? 0);
            // console.log("Channel Subscribers :", res);

        } catch (error) {
            console.error("Error fetching subscribers :", error)
        }
    }, [user._id]);

    useEffect(() => {
        handleUserProfile();
    }, [handleUserProfile])


    useEffect(() => {
        console.log("Videos --->", video);
    }, [video])

    useEffect(() => {
        if (!user._id)
            return;
        handleSubscriberFetch();
        handleChannelVideoFetch();

    }, [user._id, handleSubscriberFetch, handleChannelVideoFetch])



    // const subsriberNumberConverter = (data) => {

    // }

    const userObject = {
        name: user.fullName,
        avatar: user.avatar,
        subscribers: subscribers || 0,
        videos: video.total || 0,
        coverImage: user.coverImage
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 position-relative">
            <ChannelHeader user={userObject} />
            <ChannelVideos
                videos={video.videos}
                onEditVideo={handleEditVideo}
                onDeleteVideo={openDeleteDialog}
            />
            {deleteSuccess && (
                <div className="top-11/12 left-5/12 fixed  z-50 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg animate-bounce transition-all duration-300">
                    {deleteSuccess}
                </div>
            )}

            {videoToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-60"
                onClick={cancelDelete}
            />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete video?</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete "{videoToDelete.title}"? This action cannot be undone.
                </p>
                {deleteLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-9 w-8 border-b-5 border-blue-500"></div>
                    </div>
                ) : null}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={cancelDelete}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={confirmDelete}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
        </div >
    );
}

export default ChannelPage;
