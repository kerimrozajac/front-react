import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {
  getToken,
  //getAccessToken,
  //getCSRFToken,
  getUser,
} from "../hooks/user.actions";

const axiosService = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(async (config) => {
  /**
   * Retrieving the access token from the local storage
   */
  config.headers.Authorization = `Token ${getToken()}`;
  return config;
});

axiosService.interceptors.response.use(
  (res) => Promise.resolve(res),
  (err) => Promise.reject(err)
);

/*
const refreshAuthLogic = async (failedRequest) => {
  return axios
    .post(
      "/auth/refresh/",
      {
        refresh: getRefreshToken(),
      },
      {
        baseURL: process.env.REACT_APP_API_URL,
      }
    )
    .then((resp) => {
      const { access } = resp.data;
      failedRequest.response.config.headers["Authorization"] =
        "Token " + access;
      localStorage.setItem(
        "auth",
        JSON.stringify({ access, refresh: getRefreshToken(), user: getUser() })
      );
    })
    .catch(() => {
      localStorage.removeItem("auth");
    });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);
*/

export function fetcher(url) {
  return axiosService.get(url).then((res) => res.data);
}

export default axiosService;
