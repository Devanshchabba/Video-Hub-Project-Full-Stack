import axios from "axios";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const server = `${import.meta.env.VITE_API_BASE_URL}/playlists/`
class PlaylistService {
    async fetchPlaylists() {
        try {
            const res = await axios.get(`${server}get-user-playlists`);
            return res.data.data;
        }
        catch (error) {
            console.error("Error fetching Playlists :", error);
        }
    }
    async createPlaylist(playlistData) {
        try {
            const res = await axios.post(`${server}create-playlist`, playlistData);
            return res.data.data;
        }
        catch (error) {
            console.error("Error Creating Playlist :", error);
        }
    }
    async getPlaylistById(playlistId) {
        try {
            console.log("Fetching playlist ID", playlistId)
            const res = await axios.get(`${server}get-playlist/${playlistId}`, { withCredentials: true });
            return res.data.data;
        } catch (error) {
            console.error("Error fetching playlist By Id", error);
            throw new Error(getErrorMessage(error, "Error fetching playlist."));
        }
    }
    async addVideo({playlistId, videoId}) {
        try {
            const res = await axios.post(`${server}add-video`, { playlistId, videoId }, { withCredentials: true });
            console.log("Response from adding video", res.data.data)
            return res.data.data;

        } catch (error) {
            console.error("Error in adding video to playlist", error);
            throw new Error(getErrorMessage(error, "Error adding video to playlist."));
        }
    }
}
const playlistService = new PlaylistService();
export default playlistService
