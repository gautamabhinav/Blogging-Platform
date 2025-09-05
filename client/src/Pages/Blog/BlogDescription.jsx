// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Layout from "../../Layout/Layout";
// import axiosInstance from "../../Helper/axiosInstance";
// import { FiShare2 } from "react-icons/fi";
// import { AiOutlineLike } from "react-icons/ai";
// import { motion } from "framer-motion";
// import { io } from "socket.io-client";

// // ✅ setup socket client
// const socket = io("http://localhost:5014"); // replace with backend URL



// const BlogDescription = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { id: paramId } = useParams();

//   const { data: user, isLoggedIn } = useSelector((state) => state.auth);

//   const blogsData = useSelector((state) => state.blog?.blogsData || []);
//   const blogFromStore =
//     blogsData.find?.((b) => b?._id === location?.state?._id) || null;

//   const [blog, setBlog] = useState(location?.state || blogFromStore || null);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [likesCount, setLikesCount] = useState(blog?.likes || 0);

//   const imgSrc = blog?.thumbnail?.secure_url || blog?.previewImage || null;

//   // ---------------- Data Loaders ----------------
//   const loadBlog = useCallback(
//     async (id) => {
//       try {
//         const res = await axiosInstance.get(`/blogs/${id}`);
//         if (res?.data) {
//           setBlog(res.data);
//           setLikesCount(res.data.likes || 0);
//         }
//       } catch {
//         navigate("/blogs", { replace: true });
//       }
//     },
//     [navigate]
//   );

//   const fetchComments = useCallback(async (id) => {
//     try {
//       const res = await axiosInstance.get(`/comments/${id}`);
//       setComments(res?.data?.comments || []);
//     } catch {
//       setComments([]);
//     }
//   }, []);

//   // ---------------- Effects ----------------
//   useEffect(() => {
//     const id = paramId || blog?._id || location?.state?._id;
//     if (id) {
//       if (!blog || blog._id !== id) loadBlog(id);
//       fetchComments(id);

//       // join blog room for live updates
//       socket.emit("join_blog", id);

//       socket.on("comment_added", (newComment) => {
//         setComments((prev) => [newComment, ...prev]);
//       });

//       socket.on("comment_deleted", (commentId) => {
//         setComments((prev) => prev.filter((c) => c._id !== commentId));
//       });

//       return () => {
//         socket.off("comment_added");
//         socket.off("comment_deleted");
//       };
//     } else {
//       navigate("/blogs", { replace: true });
//     }
//   }, [paramId, blog, location, loadBlog, fetchComments, navigate]);

//   // ---------------- Actions ----------------
//   const doLike = async () => {
//     if (!blog?._id) return;
//     try {
//       const res = await axiosInstance.post(`/likes`, { postId: blog._id });
//       if (res?.data?.like) {
//         setLikesCount((c) => c + 1);
//       }
//     } catch {
//       setLikesCount((c) => c + 1);
//     }
//   };

//   const token = localStorage.getItem("token");

//   const submitComment = async () => {
//     if (!commentText.trim() || !blog?._id) return;
//     try {
//       const res = await axiosInstance.post(
//       `/comments/${blog._id}`,
//       { comment: commentText },   // request body
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // config goes here
//         },
//       }
//     );

//      if (res?.data?.comment) {
//       setComments((prev) => [res.data.comment, ...prev]); // ✅ update UI
//     }

//       setCommentText(""); // clear box
//       // socket will update UI when new_comment is broadcast
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   const removeComment = async (commentId) => {
//   if (!blog?._id) return;

//   try {
//     // 1. Delete from backend DB
//     await axiosInstance.delete(`/comments/${commentId}`, {
//       headers: { Authorization: `Bearer ${token}` }, // 🔑 send token
//     });

//     // 2. Emit socket event so everyone in room gets update
//     socket.emit("delete_comment", { blogId: blog._id, commentId });

//     // 3. Optimistically update UI (optional)
//     setComments((prev) => prev.filter((c) => c._id !== commentId));
//   } catch (err) {
//     console.error("Error deleting comment:", err.response?.data || err.message);
//   }
// };


//   const copyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       alert("Link copied to clipboard");
//     } catch {}
//   };

//   if (!blog) return null;

//   // ---------------- UI ----------------
//   return (
//     <Layout>
//       <div className="min-h-[90vh] pt-12 px-6 md:px-20 text-white">
//         <div className="max-w-5xl mx-auto bg-gradient-to-b from-white/3 to-transparent rounded-lg p-6 shadow-lg">
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Blog Content */}
//             <div className="md:w-2/3">
//               {imgSrc ? (
//                 <img
//                   src={imgSrc}
//                   alt={blog?.title}
//                   className="w-full h-64 object-cover rounded-md mb-4"
//                 />
//               ) : (
//                 <div className="w-full h-64 bg-zinc-800 rounded-md mb-4 flex items-center justify-center text-zinc-400">
//                   No image
//                 </div>
//               )}

//               <h1 className="text-3xl font-bold text-yellow-400 mb-2">
//                 {blog.title}
//               </h1>
//               <div className="flex items-center gap-4 text-sm text-zinc-300 mb-4">
//                 <span>By {blog.author || "Unknown"}</span>•{" "}
//                 {new Date(blog.createdAt || Date.now()).toLocaleString()} •{" "}
//                 <span className="px-2 py-1 bg-white/5 rounded text-xs">
//                   {blog?.category?.name || "General"}
//                 </span>
//               </div>

//               <div
//                 className="prose max-w-none text-zinc-200 mb-6"
//                 dangerouslySetInnerHTML={{
//                   __html: blog.content || blog?.description || "",
//                 }}
//               />

//               <div className="flex items-center gap-3">
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   onClick={doLike}
//                   className="flex items-center gap-2 px-3 py-2 rounded bg-white/5"
//                 >
//                   <AiOutlineLike /> Like {likesCount}
//                 </motion.button>
//                 <button
//                   onClick={copyLink}
//                   className="px-3 py-2 rounded bg-white/5 flex items-center gap-2"
//                 >
//                   <FiShare2 /> Share
//                 </button>
//               </div>

//               {/* Comments */}
//               <div className="mt-8">
//                 <h3 className="text-xl font-semibold mb-3">Comments</h3>
//                 <div className="space-y-3">
//                   <div className="flex gap-2">
//                     <input
//                       value={commentText}
//                       onChange={(e) => setCommentText(e.target.value)}
//                       placeholder="Write a comment..."
//                       className="flex-1 px-3 py-2 rounded bg-white/5"
//                     />
//                     <button
//                       onClick={submitComment}
//                       className="px-3 py-2 rounded bg-indigo-600 text-black"
//                     >
//                       Post
//                     </button>
//                   </div>

//                   <ul className="space-y-2">
//                     {comments.length === 0 ? (
//                       <div className="text-zinc-400">No comments yet.</div>
//                     ) : (
//                       comments.map((c) => (
//                         <li
//                           key={c._id}
//                           className="p-3 bg-white/5 rounded flex justify-between"
//                         >
//                           <div>
//                             <span className="font-medium">
//                               {c.user?.username || "Anonymous"}:
//                             </span>{" "}
//                             {c.comment}
//                           </div>
//                           <button
//                             onClick={() => removeComment(c._id)}
//                             className="text-red-400 text-sm"
//                           >
//                             Delete
//                           </button>
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar */}
//             <aside className="md:w-1/3 space-y-4">
//               <div className="p-4 bg-white/5 rounded">
//                 <div className="text-sm text-zinc-300">Stats</div>
//                 <div className="flex items-center gap-3 mt-2 text-white">
//                   <span className="px-2 py-1 rounded bg-white/5">
//                     Views: {blog.views || 0}
//                   </span>
//                   <span className="px-2 py-1 rounded bg-white/5">
//                     Likes: {likesCount}
//                   </span>
//                   <span className="px-2 py-1 rounded bg-white/5">
//                     Comments: {comments.length}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-4 bg-white/5 rounded">
//                 <h4 className="font-semibold">
//                   More from {blog?.category?.name || "Category"}
//                 </h4>
//                 <div className="mt-3 text-sm text-zinc-300">
//                   Explore more posts in this category from the dashboard.
//                 </div>
//                 <button
//                   onClick={() => navigate("/blogs")}
//                   className="mt-3 w-full px-3 py-2 rounded bg-indigo-600 text-black"
//                 >
//                   Browse
//                 </button>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default BlogDescription;


// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import Layout from "../../Layout/Layout";
// import axiosInstance from "../../Helper/axiosInstance";

// const BlogDescription = () => {
//   const { id: paramId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [blog, setBlog] = useState(location?.state || null);

//   const imgSrc = blog?.thumbnail?.secure_url || blog?.previewImage || null;

//   // Load Blog
//   const loadBlog = useCallback(
//     async (id) => {
//       try {
//         const res = await axiosInstance.get(`/blogs/${id}`);
//         if (res?.data) setBlog(res.data);
//       } catch {
//         navigate("/blogs", { replace: true });
//       }
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     const id = paramId || blog?._id || location?.state?._id;
//     if (id && (!blog || blog._id !== id)) loadBlog(id);
//   }, [paramId, blog, location, loadBlog]);

//   if (!blog) return null;

//   return (
//     <Layout>
//       <div className="min-h-[90vh] pt-8 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 text-white">
//         <div className="max-w-6xl mx-auto bg-gradient-to-b from-white/5 to-transparent rounded-xl p-4 sm:p-6 md:p-10 shadow-lg">
          
//           {/* Thumbnail */}
//           {imgSrc ? (
//             <img
//               src={imgSrc}
//               alt={blog?.title}
//               className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg mb-6"
//             />
//           ) : (
//             <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-zinc-800 rounded-lg mb-6 flex items-center justify-center text-zinc-400">
//               No image
//             </div>
//           )}

//           {/* Title */}
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-3 leading-snug">
//             {blog.title}
//           </h1>

//           {/* Meta */}
//           <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-zinc-300 mb-6">
//             <span>By {blog.author || "Unknown"}</span>
//             <span>•</span>
//             <span>{new Date(blog.createdAt || Date.now()).toLocaleString()}</span>
//             <span>•</span>
//             <span className="px-2 py-1 bg-white/10 rounded">
//               {blog?.category?.name || "General"}
//             </span>
//           </div>

//           {/* Blog Content */}
//           <div
//             className="prose prose-invert max-w-none text-zinc-200 text-sm sm:text-base md:text-lg leading-relaxed"
//             dangerouslySetInnerHTML={{
//               __html: blog.content || blog?.description || "",
//             }}
//           />
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default BlogDescription;


import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "../../Layout/Layout";
import axiosInstance from "../../Helper/axiosInstance";
import { FiShare2 } from "react-icons/fi";
import { motion } from "framer-motion";

const BlogDescription = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(location?.state || null);

  const imgSrc = blog?.thumbnail?.secure_url || blog?.previewImage || null;

  // Load Blog
  const loadBlog = useCallback(
    async (id) => {
      try {
        const res = await axiosInstance.get(`/blogs/${id}`);
        if (res?.data) setBlog(res.data);
      } catch {
        navigate("/blogs", { replace: true });
      }
    },
    [navigate]
  );

  useEffect(() => {
    const id = paramId || blog?._id || location?.state?._id;
    if (id && (!blog || blog._id !== id)) loadBlog(id);
  }, [paramId, blog, location, loadBlog]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("✅ Link copied to clipboard!");
    } catch {
      alert("❌ Failed to copy link.");
    }
  };

  if (!blog) return null;

  return (
    <Layout>
      <div className="min-h-[90vh] pt-8 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 text-white">
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-white/5 to-transparent rounded-xl p-4 sm:p-6 md:p-10 shadow-lg">
          
          {/* Thumbnail */}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={blog?.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg mb-6"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-zinc-800 rounded-lg mb-6 flex items-center justify-center text-zinc-400">
              No image
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-3 leading-snug">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-zinc-300 mb-6">
            <span>By {blog.author || "Unknown"}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt || Date.now()).toLocaleString()}</span>
            <span>•</span>
            <span className="px-2 py-1 bg-white/10 rounded">
              {blog?.category?.name || "General"}
            </span>
          </div>

          {/* Blog Content */}
          <div
            className="prose prose-invert max-w-none text-zinc-200 text-sm sm:text-base md:text-lg leading-relaxed mb-8"
            dangerouslySetInnerHTML={{
              __html: blog.content || blog?.description || "",
            }}
          />

          {/* Share Button */}
          <div className="flex justify-center mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={copyLink}
              className="flex items-center gap-2 px-6 py-3 rounded-full 
                        bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600
                        text-white font-semibold shadow-lg shadow-purple-500/40 
                        transition duration-300"
            >
              <FiShare2 size={20} />
              Share this Blog
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDescription;

