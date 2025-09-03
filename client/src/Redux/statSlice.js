import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const initialState = {
  allUsersCount: 0,
  subscribedUsersCount: 0,
  totals: {
    likes: 0,
    comments: 0,
    views: 0,
  },
};

// function to get the stats data from backend
export const getStatsData = createAsyncThunk("getstat", async () => {
  try {
    const res = axiosInstance.get("/admin/stats/users");
    toast.promise(res, {
      loading: "Getting the stats...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to load stats",
    });

    const response = await res;
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const getTotals = createAsyncThunk("getTotals", async () => {
  try {
    const res = await axiosInstance.get('/stats/totals');
    return res.data?.totals;
  } catch (err) {
    return { likes: 0, comments: 0, views: 0 };
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      state.allUsersCount = action?.payload?.allUsersCount;
      state.subscribedUsersCount = action?.payload?.subscribedUsersCount;
    });
    builder.addCase(getTotals.fulfilled, (state, action) => {
      state.totals = action?.payload || { likes: 0, comments: 0, views: 0 };
    });
  },
});

export const { } = statSlice.actions;
export default statSlice.reducer;