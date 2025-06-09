import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: import.meta.env.MODE === "development"
  //   ? "http://localhost:5001/api"
  //   : "https://nodejs-production-c2d7.up.railway.app/api",

  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api": "/api",
  withCredentials: true,
});