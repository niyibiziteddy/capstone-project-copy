import axios from "axios";

const baseURL = "/api/students";
console.log("API Base URL:", baseURL);
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "API-Key": import.meta.env.VITE_API_KEY,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.customMessage =
        "Unable to connect to the server. Please check your connection.";
    } else {
      error.customMessage  =
        error.response.data?.message ||
        "Something went wrong. Please try again.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
