import axios from "axios";

const api = axios.create({
  baseURL: "http://115.124.123.180:8091",
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const cartToken = localStorage.getItem("cart_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (cartToken) {
    config.headers["Cart-Token"] = cartToken;
  }

  return config;
});

export default api;