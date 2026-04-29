import axios from "axios";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const server = `${import.meta.env.VITE_API_BASE_URL}/comments/`
const likesServer = `${import.meta.env.VITE_API_BASE_URL}/likes/`

export class CommentsService {

    async getVideoComments(videoId) {
        try {
            const res = await axios.get(`${server}all-comments/${videoId}`)
            console.log("Comments Response----->", res.data)
            return res.data.data;
        } catch (error) {
            console.error("Error fetching comments", error);
            throw new Error(getErrorMessage(error, "Error fetching comments."));
        }
    }
    async addComment(commentData, videoId) {
        // if(!commentData || !videoId){
        //     console.error("Comment data or videoId is missing")
        // }
        console.log("commentData--->", commentData, "videoId---->", videoId)
        try {
            const res = await axios.post(`${server}add-comment/${videoId}`,
                { content: commentData},
                { withCredentials: true })
            return res.data.data;
        } catch (error) {
            console.error("Error adding comment", error);
            throw new Error(getErrorMessage(error, "Error adding comment."));
        }
    }
    async deleteComment(commentId) {
        try {
            const res = await axios.delete(`${server}delete-comment/${commentId}`)
            return res.data.data
        } catch (error) {
            console.error("Error Deleting comment", error);
            throw new Error(getErrorMessage(error, "Error deleting comment."));
        }
    }
    async editComment(commentId, updatedData) {
        try {
            const res = await axios.patch(`${server}update-comment/${commentId}`, updatedData,
                { withCredentials: true }
            )
            return res.data.data;
        } catch (error) {
            console.error("Error Editing comment", error);
            throw new Error(getErrorMessage(error, "Error editing comment."));
        }
    }

    async toggleCommentLike(commentId){
        try {
            const res = await axios.post(`${likesServer}toggle-comment-like/${commentId}`, {}, {withCredentials:true});
            return res.data.data;
        } catch (error) {
            console.error("Error in toggling comment like", error);
        }
    }

    async getCommentLikes(commentId){
        try{
            const res = await axios.get(`${likesServer}get-comment-likes/${commentId}`,{withCredentials:true})
            return res.data.data;
        }
        catch(error){
            console.error("Error in fetching comment likes",error);
        }
    }
}
const commentService = new CommentsService();
export default commentService
