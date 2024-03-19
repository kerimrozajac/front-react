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
  };

  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      // Registering the account and tokens in the store
      // trenutno jedina data koja se returna je "key"
      // pa se i samo to i setuje kao user data
      // znaci  user, refresh i acccess token ostaje prazno
      // i onda  vamo kad radi getUser, naravno da nista i ne geta jer nema sta da geta

      // mozda ovdje ubaciti neko fetchanje usera
      // pa bi se onda to moglo setati u user datu i tako bi se mogla i koristit getUser funkcija


      setUserData(res.data);



      navigate("/");
    });
  }

  // Register the user
  function register(data) {
    return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
      // Registering the account and tokens in the store
      setUserData(res.data);
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
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  if (auth) {
    return auth.user;
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
  return auth.key;
}

/*
// Get the CSRF token
function getCSRFToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.csrf;
}
*/

// Set the access, token and user property
// znaci ovo jedino sto sad setuje je key
function setUserData(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      key: data.key,
      access: data.access,
      //csrf: data.csrf,
      user: data.user,
    })
  );
}

export {
  useUserActions,
  getUser,
  getToken,
  getAccessToken,
  //getCSRFToken,
  setUserData,
};
