import axios from "axios";

const AXIOS = axios.create({
  baseURL: process.env.REACT_APP_FIREBASE_URL,
});

export default AXIOS;
