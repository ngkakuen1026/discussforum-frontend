import axios from "axios";
import { authAPI, baseURL } from "./http-api";

const authAxios = axios.create({
  baseURL: `${baseURL.url}`,
  withCredentials: true, 
});

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${authAPI.url}/token`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("Auth Axios Interceptors: " + res);
        console.log("Access token refreshed");

        return authAxios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;