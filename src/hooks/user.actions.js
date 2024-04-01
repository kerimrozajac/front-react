import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";

function useUserActions() {
  const navigate = useNavigate();
  //const history = useHistory();
  const baseURL = process.env.REACT_APP_API_URL;

  return {
    login,
    register,
    logout,
    edit,
    fetchUser,
  };


  /*
  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {

      // postavlja key iz responsa
      setKey(res.data.key);
      
      // salje request da dobije informaciju o useru
      //fetchUser();

      // NOTE!!
      // ovo ovdje ne valja
      // jednostavno traje predugo

      // treba rastaviti na step by step

      // navigacija treba da se desi 

      fetchUser().then(navigate("/"));

      // navigira na home screen
      //navigate("/");
      //history.push("/");
    });
  }
  */
  // NAPOMENA!!!
  // PROBATI ASYNC LOGIN I FETCH
  // wait for the user data before setting it and then wait for it to be set before continuing to navigate

  
  async function login(data) {
    try {
      const res = await axios.post(`${baseURL}/auth/login/`, data);
      setKey(res.data.key);
      const userData = await fetchUser(); // Wait for user data to be fetched
      navigate("/"); // Navigate to home page after successful login
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }
  

  /*
  // Fetch user
  // vraca informaciju o useru i salje je na pohranu u lkalni storage
  function fetchUser() {
    return axiosService
    .get(`${baseURL}/auth/user/`)
    .then((userRes) => {
      setUser(userRes.data);
    });
  }
  */

  // probati async fetch user funkciju

  
  async function fetchUser() {
    try {
      const userRes = await axiosService.get(`${baseURL}/auth/user/`);
      setUser(userRes.data); // Assuming setUser is a function that sets user data
      return userRes.data; // Return the user data
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
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
  console.log("User from localStorage:", user);
  if (user) {
    return user;
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


// Set the user property
function setUser(user) {
  localStorage.setItem(
    "user",
    JSON.stringify(//{
      //user: user,
      user
    //}
    )
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
