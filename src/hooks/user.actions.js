import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  return {
    login,
    register,
    logout,
    edit,
    fetchUser,
  };

  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {

      // postavlja key iz responsa
      setKey(res.data.key);
      
      // salje request da dobije informaciju o useru
      fetchUser();

      // navigira na home screen
      navigate("/");
    });
  }

  // Fetch the user
  function fetchUser() {
    return axiosService
    .get(`${baseURL}/auth/user/`)
    .then((userRes) => {
      setUser(userRes.data);
    });
  }

  // Register the user
  function register(data) {
    return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
      // Registering the account and tokens in the store
      setUser(res.data);
      navigate("/"); 
    });
  }

  // Edit the user
  function edit(data, userId) {
    return axiosService
      .patch(`${baseURL}/users/${userId}/`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        // Registering the account in the store
        localStorage.setItem(
          "auth",
          JSON.stringify({
            key: getToken(),
            access: getAccessToken(),
            //csrf: getCSRFToken(),
            user: res.data,
          })
        );
      });
  }

  // Logout the user
  function logout() {
    return axiosService
      .post(`${baseURL}/auth/logout/`)
      .then(() => {
        localStorage.removeItem("auth");
        navigate("/login");
      });
  }
}

// Get the user
function getUser() {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  if (user) {
    return user.user;
  } else {
    return null;
  }
}

// znaci ovo nema sta da geta kad nista i ne seta pod auth.access
// Get the access token
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.access;
}

// Get the auth key token
function getToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  console.log("Auth from localStorage:", auth);
  return auth.key;
}



/*
// Get the CSRF token
function getCSRFToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.csrf;
}
*/

// Set the user property
function setUser(user) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      user: user,
    })
  );
}

function setKey(key) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      key: key,
    })
  );
}



export {
  useUserActions,
  getUser,
  getToken,
  getAccessToken,
  //getCSRFToken,
  setUser as setUserData,
  setKey,
};
