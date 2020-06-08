import Axios from "axios";
import { getToken } from "./helpers";

const axios = Axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

// request interceptor to add the token
axios.interceptors.request.use((request) => {
  const authInfo = getToken();
  if (authInfo) {
    request.headers["token"] = `${authInfo}`;
    request.headers["Content-Type"] = "application/json";
  }
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        error.response.data.detail = "Invalid Token";
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
