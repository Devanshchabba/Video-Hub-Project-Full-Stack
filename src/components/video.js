import axios from "axios"
import Error from "../pages/Error";


const server = "/api/v1/videos/"
export class VideoService {
    async handleGetAllVideos(opts) {
        const page = opts.page || 1;
        const limit = opts.limit || 10;
        const query = opts.query || "";
        const sortBy = opts.sortBy || "createdAt";
        const sortType = opts.sortType || "desc";
        const userId = opts.userId || undefined;
        try {
            const params = {
                page: Number(page),
                limit: Number(limit),
                query: query || undefined,
                sortBy,
                sortType,
                userId: userId || undefined,
            };
            const response = await axios.get(server, { params })
            const statusCode = response.data?.statusCode;
            const payload = response.data?.data;
            const message = response.data?.message;

            if (!payload) console.error("Payload not getting")

            const isOkay = statusCode === 200
            if (!isOkay) console.log(message || "Failed to fetch videos")

            const data = payload || {};

            return {
                videos: data.videos || [],
                total: data.total || 0,
                currentPage: data.currentPage || Number(page),
                totalPages: data.totalPages || Math.ceil((data.total || 0) / Number(limit)),
                message: payload.message || "Videos fetched successfully",
            };

        } catch (error) {
            console.log("Error in fetching video :", error)
            throw error;
        }
    }
    async getVideo(videoId) {
        try {
            const response = await axios.get(`${server}video/${videoId}`)
            return response
        } catch (error) {
            console.error("Error in fetching video", error)
            throw error
        }
    }
    async handleUploadVideo(opts) {
        try {
            const response = await axios.post(`${server}upload`, opts)
            return response.data
        } catch (error) {
            console.error("Error in uploading video:", error)
            throw error
        }
    }
    async getChannelVideos(channelId) {
        try {
            const res = await axios.get(`${server}get-channel-videos/${channelId}`, { withCredentials: true })
            return res.data.data
        } catch (error) {
            console.error("Error in fetching channel videos", error)
        }
    }
    async toggleLike(_id) {
        try {
            const res = await axios.post(`/api/v1/likes/toggle-like/${_id}`, { withCredentials: true });
            return res.data.data;
        } catch (error) {
            console.error("Error in toggling like", error);
        }
    }
    async getVideoLikes(videoId) {
        try {
            // console.log("Fetching likes for videoId==========>:",videoId);
            const res = await axios.get(`/api/v1/likes/get-video-likes/${videoId}`,{ withCredentials: true });
            console.log("Response from getVideoLikes --->", res.data);
            return res.data.data;
        } catch (error) {
            console.error("Error in fetching video Likes", error);
        }
    }
    
}



const videoService = new VideoService()
export default videoService