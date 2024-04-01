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


  
  // login user
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
  


  // Fetch user
  // vraca informaciju o useru i salje je na pohranu u lkalni storage

  async function fetchUser() {
    try {
      const userRes = await axiosService.get(`${baseURL}/auth/user/`);
      setUser(userRes.data); // forwarding the user data to be set
      return userRes.data; // retturning the user data
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

  // POTREBNO REFAKTORISAT
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
        localStorage.removeItem("user");
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

/*
// znaci ovo nema sta da geta kad nista i ne seta pod auth.access
// Get the access token
function getToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.key;
}
*/

// Get the auth key token
function getToken() {
  const key = JSON.parse(localStorage.getItem("key"));
  console.log("Auth from localStorage:", key);
  return key;
}


// Set the user property
function setUser(user) {
  localStorage.setItem(
    "user",
    JSON.stringify(
      user
    )
  );
}

/*
function setKey(key) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      key: key,
    })
  );
}
*/

// test
function setKey(key) {
  localStorage.setItem(
    "key",
    JSON.stringify(
      key
    )
  );
}


export {
  useUserActions,
  getUser,
  getToken,
  //getAccessToken,
  //getCSRFToken,
  setUser as setUserData,
  setKey,
};
