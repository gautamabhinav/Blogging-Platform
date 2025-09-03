// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as api from '../Helper/blogAPI';

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Helper/axiosInstance";
import toast from "react-hot-toast";
import { calcLength } from "framer-motion";

// export const fetchBlogs = createAsyncThunk('blogs/fetchAll',
//   async (params, { rejectWithValue }) => {
//     try {
//       const res = await api.getBlogs(params);
//       return res.data; // { page, items, ... }
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   });

// export const fetchBlog = createAsyncThunk('blogs/fetchOne',
//   async (slug, { rejectWithValue }) => {
//     try {
//       const res = await api.getBlogBySlug(slug);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   });

// export const createBlog = createAsyncThunk('blogs/create',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await api.postBlog(payload);
//       return res.data.data; // match your backend response shape
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   });

// const slice = createSlice({
//   name: 'blogs',
//   initialState: { list: [], single: null, loading: false, error: null, meta: {} },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBlogs.pending, state => { state.loading = true; state.error = null; })
//       .addCase(fetchBlogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload.items || action.payload;
//         state.meta = { page: action.payload.page, totalPages: action.payload.totalPages };
//       })
//       .addCase(fetchBlogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

//       .addCase(fetchBlog.fulfilled, (state, action) => { state.single = action.payload; })
//       .addCase(createBlog.fulfilled, (state, action) => { state.list.unshift(action.payload); });
//   }
// });

// export default slice.reducer;






///////////////////////////////////////////////////////////////////////////////////////////////////



const initialState = {
  blogsData: [],
};


// function to get all blogs
export const getAllBlogs = createAsyncThunk("/blog/get", async () => {

  try {
    const res = axiosInstance.get("/posts");
    // console.log(res.data.blogs);
    // console.log("API response:", res.data);


    toast.promise(res, {
      loading: "Loading blogs data...",
      success: "blogs loaded successfully",
      error: "Failed to get blogs",
    });

    const response = await res;
    // console.log("API response getall:", response.data);

    return response.data.posts;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// function to create a new blog
// function to create a new blog
export const createNewBlog = createAsyncThunk(
  "/get/posts",
  async (data) => {
    try {
      // creating the form data from user data
      // title, content, author, createdBy, role

      let formData = new FormData();
      formData.append("title", data?.title);
      formData.append("content", data?.content);
      formData.append("author", data?.author);
      formData.append("createdBy", data?.createdBy);
      formData.append("category", data?.category);
      formData.append("thumbnail", data?.thumbnail);
      formData.append("description", data?.description); // Add description to form data

      const res = axiosInstance.post("/posts", formData);

      toast.promise(res, {
        loading: "Creating the blog...",
        success: "Blog created successfully",
        error: "Failed to create blog",
      });

      const response = await res;
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to delete the blog
export const deleteBlog = createAsyncThunk("/blog/delete", async (id) => {
  try {
    const res = axiosInstance.delete(`posts/${id}`);

    toast.promise(res, {
      loading: "Deleting the blog...",
      success: "Blog deleted successfully",
      error: "Failed to delete blog",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// function to update the blog details
export const updateBlog = createAsyncThunk("/blog/update", async (data) => {
  try {
    
    // creating the form data from user data
    // title, content, author, createdBy
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("createdBy", data.createdBy);
    formData.append("category", data.category);
    formData.append("author", data.author);
    formData.append("description", data.description || "");
    // backend is not allowing change of thumbnail
    // if (data.thumbnail) {
    //   formData.append("thumbnail", data.thumbnail);
    // }


        // ✅ category must be ID (ObjectId string)
    if (data.category) {
      formData.append("category", data.category); 
    }


    const res = axiosInstance.put(`/posts/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      title: data.title,
      author: data.author,
      createdBy: data.createdBy,
      content: data.content,
      // category: data.category,
      // thumbnail: data.thumbnail, // Add description to form data;
      description: data.description,
      // thumbnail: data.thumbnail, // Add description to form data;

    });

    toast.promise(res, {
      loading: "Updating the blog...",
      success: "Blog updated successfully",
      error: "Failed to update blog",
    });

    const response = await res;
     console.log("API response update:", response.data);
    return response.data;
  } catch (error) {
    // console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

export const getAllComments = createAsyncThunk("/blog/get", async () => {

  try {
    const res = axiosInstance.get("/posts");
    // console.log(res.data.blogs);
    // console.log("API response:", res.data);


    toast.promise(res, {
      loading: "Loading blogs data...",
      success: "blogs loaded successfully",
      error: "Failed to get blogs",
    });

    const response = await res;
    console.log("API response getall:", response.data);

    return response.data.posts;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// function to create a new blog
export const createNewComment = createAsyncThunk(
  "/get/posts",
  async (data) => {
    // console.log(data);
    try {
      // creating the form data from user data
      // title, content, author, createdBy

      let formData = new FormData();
      formData.append("title", data?.title);
      formData.append("content", data?.content);
      formData.append("author", data?.author);
      formData.append("createdBy", data?.createdBy);
      formData.append("category", data?.category);
      formData.append("thumbnail", data?.thumbnail);

      const res = axiosInstance.post("/posts", formData);

      toast.promise(res, {
        loading: "Creating the blog...",
        success: "Blog created successfully",
        error: "Failed to create blog",
      });

      
      const response = await res;
       console.log("API response create:", response.data);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to delete the blog
export const deleteComment = createAsyncThunk("/blog/delete", async (id) => {
  try {
    const res = axiosInstance.delete(`posts/${id}`);

    toast.promise(res, {
      loading: "Deleting the blog...",
      success: "Blog deleted successfully",
      error: "Failed to delete blog",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// function to update the blog details
export const updateComment = createAsyncThunk("/blog/update", async (data) => {
  try {
    
    // creating the form data from user data
    // title, content, author, createdBy
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("createdBy", data.createdBy);
    formData.append("author", data.author);
    // backend is not allowing change of thumbnail
    // if (data.thumbnail) {
    //   formData.append("thumbnail", data.thumbnail);
    // }

    const res = axiosInstance.put(`/posts/${data.id}`, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },

      title: data.title,
      author: data.author,
      createdBy: data.createdBy,
      content: data.content,

    });

    toast.promise(res, {
      loading: "Updating the blog...",
      success: "Blog updated successfully",
      error: "Failed to update blog",
    });

    const response = await res;
     console.log("API response update:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});



const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(getAllBlogs.pending, (state) => {
      state.blogsData = []; // optional: clear or set loading flag
    })
    .addCase(getAllBlogs.rejected, (state) => {
      state.blogsData = []; // stays empty if error
    })
    .addCase(getAllBlogs.fulfilled, (state, action) => {
      if (action.payload) {
        // console.log(action.payload);
        state.blogsData = [...action.payload];
      }
    });
  },
});

// export const {} = blogSlice.actions;
export default blogSlice.reducer;
