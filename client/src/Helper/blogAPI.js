import axiosInstance from './axiosInstance';

export const getBlogs = (params) => axiosInstance.get('/blogs', { params });
export const getBlogBySlug = (slug) => axiosInstance.get(`/blogs/${slug}`);
export const postBlog = (data) => axiosInstance.post('/blogs', data);
export const updateBlog = (id, data) => axiosInstance.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => axiosInstance.delete(`/blogs/${id}`);