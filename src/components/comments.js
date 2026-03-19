import axios from "axios";

const server = "/api/v1/comments/"

export class CommentsService {

    async getVideoComments(videoId) {
        try {
            const res = await axios.get(`${server}all-comments/${videoId}`)
            console.log("Comments Response----->", res.data)
            return res.data.data;
        } catch (error) {
            console.error("Error fetching comments", error);
            throw error;
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
            throw error;
        }
    }
    async deleteComment(commentId) {
        try {
            const res = await axios.delete(`${server}delete-comment/${commentId}`)
            return res.data.data
        } catch (error) {
            console.error("Error Deleting comment", error);
            throw error;
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
            throw error;
        }
    }

    async toggleCommentLike(commentId){
        try {
            const res = await axios.post(`/api/v1/likes/toggle-comment-like/${commentId}`, {withCredentials:true});
            return res.data.data;
        } catch (error) {
            console.error("Error in toggling comment like", error);
        }
    }

    async getCommentLikes(commentId){
        try{
            const res = await axios.get(`/api/v1/likes/get-comment-likes/${commentId}`,{withCredentials:true})
            return res.data.data;
        }
        catch(error){
            console.error("Error in fetching comment likes",error);
        }
    }
}
const commentService = new CommentsService();
export default commentService