import { api } from "../components/api.js";
import axios from 'axios';
import { publicApi } from "../components/publicApi.js"

const baseURL = import.meta.env.VITE_API_BASE_URL;

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;
api.defaults.baseURL = baseURL;
api.defaults.withCredentials = true;
publicApi.defaults.baseURL = baseURL;
publicApi.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error("Axios interceptor error response  --- > ", error.config);
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axios(originalRequest));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await publicApi.post("/users/refresh-token");
        processQueue(null);
        return axios(originalRequest);
      } catch (err) {
        processQueue(err);
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
