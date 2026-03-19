import axios from "axios";

export  const publicApi = axios.create({
  baseURL: "/api/v1",
  withCredentials: true
});