import Axios, { AxiosError } from "axios";
const BASE_API_URL = "https://api.rahtash-tms.ir";

const axios = Axios.create({
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
  baseURL: BASE_API_URL,
});

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.log("error🛑:", error);
    }
    if (error?.status === 401 || error.response?.status === 401) {
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = `/login`;
      }
    }

    return Promise.reject(error);
  },
);

export { axios };
