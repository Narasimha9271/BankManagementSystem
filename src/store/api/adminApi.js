import axios from "axios";
import useAuthStore from "../authStore";

const adminApi = axios.create({
  baseURL: "http://localhost:8083",
});

adminApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminApi;
