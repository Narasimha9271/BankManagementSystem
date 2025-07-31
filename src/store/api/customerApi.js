import axios from "axios";
import useAuthStore from "../authStore";

const customerApi = axios.create({
  baseURL: "http://localhost:8081",
});

customerApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default customerApi;
