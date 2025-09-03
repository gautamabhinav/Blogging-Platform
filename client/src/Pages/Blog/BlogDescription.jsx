import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import axiosInstance from "../../Helper/axiosInstance";
import { FiShare2 } from "react-icons/fi";
import { AiOutlineLike } from "react-icons/ai";
import { motion } from "framer-motion";
// import { getAllBlogs } from "../../Redux/blogSlice"; // ← uncomment if you have this

const BlogDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: paramId } = useParams();

  const blogsData = useSelector((state) => state.blog?.blogsData || []);
  const blogFromStore =
    blogsData.find?.((b) => b?._id === location?.state?._id) || null;

  const [blog, setBlog] = useState(location?.state || blogFromStore || null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [likesCount, setLikesCount] = useState(blog?.likes || 0);
  const [liked, setLiked] = useState(false);

  const imgSrc = blog?.thumbnail?.secure_url || blog?.previewImage || null;

  // ---------------- Data Loaders ----------------
  const loadBlog = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get(`/posts/${id}`);
      const payload = res?.data?.blog || res?.data?.post || res?.data;
      if (payload) {
        setBlog(payload);
        setLikesCount(payload.likes || 0);
      }
    } catch {
      navigate("/blogs", { replace: true });
    }
  }, [navigate]);

  const buildTree = useCallback((items) => {
    const map = new Map();
    const roots = [];
    items.forEach((it) => map.set(it._id, { ...it, replies: [] }));
    items.forEach((it) => {
      const parentId = it.parentId || it.parent;
      parentId && map.has(parentId)
        ? map.get(parentId).replies.push(map.get(it._id))
        : roots.push(map.get(it._id));
    });
    return roots;
  }, []);

  const fetchComments = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get(`/posts/${id}/comments`);
      const flat = res?.data?.comments || [];
      setComments(buildTree(flat));
    } catch {
      setComments([]);
    }
  }, [buildTree]);

  // ---------------- Effects ----------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const id = paramId || blog?._id || location?.state?._id;
    if (id) {
      if (!blog || blog._id !== id) loadBlog(id);
      fetchComments(id);
    } else {
      navigate("/blogs", { replace: true });
    }
  }, [paramId, blog, location, loadBlog, fetchComments, navigate]);

  // ---------------- Actions ----------------
  const doLike = async () => {
    if (!blog?._id) return;
    try {
      const res = await axiosInstance.post(`/likes`, { postId: blog._id });
      if (res?.data?.like) {
        setLiked(true);
        await loadBlog(blog._id);
      }
    } catch {
      setLikesCount((c) => c + 1);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axiosInstance.post(`/posts/${blog._id}/comments`, {
        comment: commentText,
        author: "Anonymous",
      });
      await fetchComments(blog._id);
    } catch {
      setComments((c) => [
        {
          _id: Date.now(),
          comment: commentText,
          author: "You",
          createdAt: new Date().toISOString(),
          replies: [],
        },
        ...c,
      ]);
    } finally {
      setCommentText("");
    }
  };

  const submitReply = async (parentId) => {
    const text = (replyTextMap[parentId] || "").trim();
    if (!text) return;

    const optimisticReply = {
      _id: `r-${Date.now()}`,
      comment: text,
      author: "You",
      createdAt: new Date().toISOString(),
    };

    setComments((prev) =>
      prev.map((c) =>
        c._id === parentId
          ? { ...c, replies: [...(c.replies || []), optimisticReply] }
          : c
      )
    );
    setReplyTextMap((s) => ({ ...s, [parentId]: "" }));
    setReplyTo(null);

    try {
      await axiosInstance.post(`/posts/${blog._id}/comments`, {
        comment: text,
        author: "Anonymous",
        parentId,
      });
      await fetchComments(blog._id);
    } catch {
      // keep optimistic reply
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    } catch {}
  };

  // ---------------- Components ----------------
  const ReplyInput = ({ parentId }) => (
    <div className="mt-3 flex gap-2">
      <input
        value={replyTextMap[parentId] || ""}
        onChange={(e) =>
          setReplyTextMap((s) => ({ ...s, [parentId]: e.target.value }))
        }
        placeholder="Write a reply..."
        className="flex-1 px-3 py-2 rounded bg-white/5"
      />
      <button
        onClick={() => submitReply(parentId)}
        className="px-3 py-2 rounded bg-indigo-600 text-black"
      >
        Reply
      </button>
      <button
        onClick={() => setReplyTo(null)}
        className="px-3 py-2 rounded bg-red-600"
      >
        Cancel
      </button>
    </div>
  );

  const CommentItem = ({ node, depth = 0 }) => (
    <div className="p-3 bg-white/5 rounded" style={{ marginLeft: depth ? 8 : 0 }}>
      <div className="flex items-center justify-between">
        <div className="font-medium">{node.author || "Anonymous"}</div>
        <div className="text-xs text-zinc-400">
          {new Date(node.createdAt || Date.now()).toLocaleString()}
        </div>
      </div>

      <div
        className="mt-2 text-sm text-zinc-200"
        dangerouslySetInnerHTML={{ __html: node.comment }}
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setReplyTo(node._id)}
          className="text-sm text-indigo-300"
        >
          Reply
        </button>
        {node.replies?.length > 0 && (
          <div className="text-xs text-zinc-400">
            {node.replies.length} repl{node.replies.length > 1 ? "ies" : "y"}
          </div>
        )}
      </div>

      {replyTo === node._id && <ReplyInput parentId={node._id} />}

      {node.replies?.length > 0 && (
        <div className="mt-3 pl-4 space-y-2 border-l border-white/5">
          {node.replies.map((r) => (
            <CommentItem key={r._id} node={r} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (!blog) return null;

  // ---------------- UI ----------------
  return (
    <Layout>
      <div className="min-h-[90vh] pt-12 px-6 md:px-20 text-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-b from-white/3 to-transparent rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Blog Content */}
            <div className="md:w-2/3">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={blog?.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-zinc-800 rounded-md mb-4 flex items-center justify-center text-zinc-400">
                  No image
                </div>
              )}

              <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-zinc-300 mb-4">
                <span>By {blog.author || "Unknown"}</span>•{" "}
                {new Date(blog.createdAt || Date.now()).toLocaleString()} •{" "}
                <span className="px-2 py-1 bg-white/5 rounded text-xs">
                  {blog?.category?.name || "General"}
                </span>
              </div>

              <div
                className="prose max-w-none text-zinc-200 mb-6"
                dangerouslySetInnerHTML={{
                  __html: blog.content || blog?.description || "",
                }}
              />

              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={doLike}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-white/5"
                >
                  <AiOutlineLike /> Like {likesCount}
                </motion.button>
                <button
                  onClick={copyLink}
                  className="px-3 py-2 rounded bg-white/5 flex items-center gap-2"
                >
                  <FiShare2 /> Share
                </button>
              </div>

              {/* Comments */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Comments</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 rounded bg-white/5"
                    />
                    <button
                      onClick={submitComment}
                      className="px-3 py-2 rounded bg-indigo-600 text-black"
                    >
                      Post
                    </button>
                  </div>

                  <div className="space-y-2">
                    {comments.length === 0 ? (
                      <div className="text-zinc-400">No comments yet.</div>
                    ) : (
                      comments.map((c) => (
                        <CommentItem key={c._id || c.createdAt} node={c} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="md:w-1/3 space-y-4">
              <div className="p-4 bg-white/5 rounded">
                <div className="text-sm text-zinc-300">Stats</div>
                <div className="flex items-center gap-3 mt-2 text-white">
                  <span className="px-2 py-1 rounded bg-white/5">
                    Views: {blog.views || 0}
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5">
                    Likes: {likesCount}
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5">
                    Comments: {comments.length}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded">
                <h4 className="font-semibold">
                  More from {blog?.category?.name || "Category"}
                </h4>
                <div className="mt-3 text-sm text-zinc-300">
                  Explore more posts in this category from the dashboard.
                </div>
                <button
                  onClick={() => navigate("/blogs")}
                  className="mt-3 w-full px-3 py-2 rounded bg-indigo-600 text-black"
                >
                  Browse
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDescription;
