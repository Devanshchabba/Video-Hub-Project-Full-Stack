import axios from "axios";
const server = "/api/v1/users/"

export class AuthService {

    async register(opts) {
        try {
            const res = await axios.post(`${server}register`, opts)
            console.log("Response of the registration  ----  > ", res.data.data);
            return res.data.data;
        } catch (error) {
            console.error("Error registering user", error);
            throw error;
        }
    }
    async userProfile() {
        try {
            const response = await axios.get(`${server}get-user-profile`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching user profile", error);
            throw error;
        }
    }
    async login({ indentifier, password }) {
        const formData = {
            indentifier: indentifier,
            password: password,
        }
        try {
            const response = await axios.post(`${server}login`, formData);
            const responseData = response.data
            const token = responseData.data.refreshToken
            if (token) {
                localStorage.setItem("refreshToken", token);
                return responseData.data;
            }
        } catch (error) {
            console.error("Error logging in user", error);
            throw error
        }
    }
    async logout() {
        try {
            const response = await axios.post(`${server}logout`)
            let responseData = response.data;

            if (responseData.data.refreshToken || responseData.data.accessToken) {
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("accessToken");
            }
            return responseData;

        } catch (error) {
            console.error("Error logging Out user", error);
            throw error;
        }

    }
    async changePassword(userData) {
        try {
            const response = await axios.patch(`${server}change-password`, userData,
                {

                }
            )
            const responseData = response.data;
            return [response.statusCode, responseData.message];

        } catch (error) {
            console.error("Error during handling ChangePassword", error);
            throw error;
        }
    }
    async getUser() {
        try {
            const response = await axios.get(`${server}get-user-profile`)
            return response.data.data;
        } catch (error) {
            console.error("Error in fetching user", error)
        }
    }
    async getChannelProfile(userName) {
        try {
            // console.log("Fetching channel profile for userName:", userName);
            const response = await axios.get(
                `${server}user-channel/${userName}`,
                { withCredentials: true }
            );

            // console.log("Channel Data Response --->", response.data);
            return response.data.data;
        } catch (error) {
            console.error("Error in fetching Channel Data", error);
            throw error;
        }
    }

    async renewToken() {
        // const token = localStorage.getItem("refreshToken");
        try {
            const response = await axios.post(`${server}refresh-token`, {}, { withCredentials: true })
            console.log(response.data.data)
        } catch (error) {
            console.error("Error in Regenerating Access Token", error)
        }
    }
}
const authService = new AuthService()
export default authService
