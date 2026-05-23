import axios from 'axios'
import { getErrorMessage } from "../utils/getErrorMessage.js";
const server = `${import.meta.env.VITE_API_BASE_URL}/tweets`

export class TweetService {
    async createTweet(opts) {
        try {
            const res = await axios.post(`${server}/create-tweet`, opts);
            return res?.data?.data;
        } catch (err) {
            console.error("Error in creating tweet", err);
            return null;
        }
    }
    async editTweet(tweetId) {
        try {
            const res = await axios.patch(`${server}/update-tweet/${tweetId}`);
            return res.data?.data;
        } catch (error) {
            console.error("Error in updating tweet", error);
            return null;
        }
    }
    async deleteTweet(tweetId) {
        try {
            const res = await axios.delete(`${server}/delete-tweet/${tweetId}`);
            return res.data?.data;
        } catch (error) {
            console.error("Error in deleting tweet", error);
            return null;
        }
    }
    async getTweet(tweetId) {
        try {
            const res = await axios.get(`${server}/get-tweet/${tweetId}`);
            return res.data?.data;
        }
        catch (error) {
            console.error("Error in fetching tweet", error);
            return null;
        }
    }
    async getAllTweets(opts) {
        const page = opts.page || 1;
        const limit = opts.limit || 10;
        const query = opts.query || "";
        const sortBy = opts.sortBy || "createdAt";
        const sortType = opts.sortType || "desc";
        const userId = opts.userId || undefined;
        const params = {
            page:Number(page),
            limit:Number(limit),
            query: query || undefined,
            sortBy,
            sortType,
            userId: userId || undefined,
        }
        try {
            const res = await axios.get(`${server}/get-all-tweets`, { params});
            return res.data?.data;
        } catch (error) {
            console.error("Error in fetching all tweets", error);
            return null;
        }
    }
}
const tweetService  = new TweetService();
export default tweetService;
