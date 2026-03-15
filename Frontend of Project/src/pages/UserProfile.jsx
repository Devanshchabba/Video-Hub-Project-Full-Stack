import { ChannelHeader, ChannelVideos } from "./index.jsx";
import authService from "../components/user.js";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
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
    const [subscribers, setSubscribers] = useState({})

    const userName = useParams();

    const handleUserProfile = async () => {
        try {
            const response = await authService.getChannelProfile(userName.userName);
            // console.log("User Profile --->", response);
            setUser(response);
        } catch (error) {
            console.error("Error fetching user profile", error)
        }
    }
    const handleChannelVideoFetch = async () => {
        try {
            const response = await videoService.getChannelVideos(user._id);
            console.log("Channel video --->", response);
            if (response) {
                setVideo(response);
                
            }
        } catch (error) {
            console.error("Error in fetching videos :", error)
        }
    }

    const handleSubscriberFetch = async () => {
        try {
            // console.log("User Id is ---> ", user._id)
            const res = await subscriptionService.handleUserSubscribers(user._id);
            setSubscribers(res);
            // console.log("Channel Subscribers :", res);

        } catch (error) {
            console.error("Error fetching subscribers :", error)
        }
    }

    useEffect(() => {
        handleUserProfile();
    }, [])


    useEffect(() => {
        console.log("Videos --->", video);
    }, [video])

    useEffect(() => {
        if (!user._id)
            return;
        handleSubscriberFetch();
        handleChannelVideoFetch();

    }, [user._id])



    // const subsriberNumberConverter = (data) => {

    // }

    const userObject = {
        name: user.fullName,
        avatar: user.avatar,
        subscribers: subscribers.data || 0,
        videos: video.total || 0,
        coverImage: user.coverImage
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <ChannelHeader user={userObject} />
            <ChannelVideos videos={video.videos} />
        </div>
    );
}

export default ChannelPage;
