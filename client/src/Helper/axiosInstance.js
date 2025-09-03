import axios from "axios";

// const BASE_URL = "http://localhost:5014/api/v1";

// Before (this causes CORS without proxy):
// const BASE_URL = "http://localhost:5014/api/v1";

// After (with proxy in place):
const BASE_URL = "/api/v1";

// const BASE_URL = "https://lms-deploy-y4le.onrender.com/api/v1";


const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
