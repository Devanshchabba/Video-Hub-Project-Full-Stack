import axios from "axios";
const server = "/api/v1/subscription"

export  class SubscriptionService {
    async handleUserSubscribers(channelId){
        // console.log("User ID ---> ",channelId)
        try {
            // console.log("Fetching subscribers for channel ID:", channelId);
            const res = await axios.get(`${server}/user-subscribers-count/${channelId}`)
            // console.log("Response------>",res.data)
            return res.data;

        } catch (error) {
            console.error("Error in fetching userSubscribers",error);
        }
    }
    async handleToggleSubscribe(channelId){
        try {
            const res = await axios.post(`${server}/toggle-subscribe/${channelId}`)
            return res.data;
        } catch (error) {
            console.log("Error in fetching toggle Subscribe",error)
        }
    }
    async handleIsSubscribed(channelId){
        try{
            const res = await axios.get(`${server}/is-subscribed/${channelId}`)
            return res.data.data ;
        }
        catch(error){
            console.error("Error in fetching isSubscribed",error)
            throw error
        }
    }
}
const subscriptionService = new SubscriptionService()
export default subscriptionService

