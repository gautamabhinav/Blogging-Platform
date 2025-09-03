import { configureStore } from "@reduxjs/toolkit";
import blogSliceReducer from "../Redux/blogSlice";
import authSliceReducer from "../Redux/authSlice";
import statSliceReducer from "../Redux/statSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    blog: blogSliceReducer,
    stat: statSliceReducer,
  },
});

export default store;