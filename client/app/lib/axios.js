import axios from "axios";
import { useUser } from "@/app/contexts/UserContext";

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  instance.interceptors.request.use(
    async (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Force logout if refresh fails
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const refreshToken = async () => {
  // Implement your token refresh logic here
  // This should call your backend refresh endpoint
};

export default createAxiosInstance();