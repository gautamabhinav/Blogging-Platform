import axios from "axios";

// const BASE_URL = "http://localhost:5014/api/v1";

// Before (this causes CORS without proxy):
// const BASE_URL = "http://localhost:5014/api/v1";

// After (with proxy in place): Development mode:
// const BASE_URL = "/api/v1"; -> devlopment mode

// Production mode:
const BASE_URL = "/api/v1";  

// go to vite config .js to add proxy: https://blogging-platform-hlwi.onrender.com in place of localhost:5014


const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;



export default axiosInstance;
