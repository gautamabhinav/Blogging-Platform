import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../Layout/Layout";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { createNewBlog, deleteBlog, getAllBlogs, updateBlog } from "../../Redux/blogSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { HiOutlineCheck, HiOutlineSave, HiOutlineX } from "react-icons/hi";

const TAG_OPTIONS = ["Development", "React", "Node", "Design", "Product", "Tutorial"];

const UserDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const blogsData = useSelector((state) => state.blog?.blogsData || []);
    const [query, setQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [localLikes, setLocalLikes] = useState({});

    const { quill, quillRef } = useQuill({
        theme: "snow",
        modules: {
            toolbar: [
                ["bold", "italic", "underline"],
                [{ header: [1, 2, 3, false] }],
                ["link", "image"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "code-block"],
            ],
        },
    });

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);

    // derive filtered list
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (blogsData || []).filter((b) => {
            if (!b) return false;
            const matchQ = q
                ? (b.title || "").toLowerCase().includes(q) || (b?.content || "").toLowerCase().includes(q)
                : true;
            const matchTags = selectedTags.length
                ? Array.isArray(b.tags)
                    ? selectedTags.every((t) => b.tags.includes(t))
                    : selectedTags.includes(b?.category?.name || b?.category)
                : true;
            return matchQ && matchTags;
        });
    }, [blogsData, query, selectedTags]);

    const handleThumbnail = (e) => {
        const f = e.target.files?.[0];
        if (f) setThumbnail(f);
    };

    const handleToggleTag = (tag) => {
        setSelectedTags((s) => (s.includes(tag) ? s.filter((t) => t !== tag) : [...s, tag]));
    };

    const publish = async (status = "published") => {
        const content = quill?.root?.innerHTML || "";
        if (!title || !content) return alert("Please provide title and content");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("author", "Me");
        formData.append("createdBy", "Me");
        formData.append("category", category || selectedTags[0] || "General");
        formData.append("tags", JSON.stringify(selectedTags));
        formData.append("status", status);
        if (thumbnail) formData.append("thumbnail", thumbnail);

        const res = await dispatch(createNewBlog(formData));
        if (res?.meta?.requestStatus === "fulfilled" && res?.payload?.success) {
            // reset editor
            setTitle("");
            setCategory("");
            setThumbnail(null);
            setSelectedTags([]);
            // if (quill) quill.setText("");
            // refresh list
            dispatch(getAllBlogs());
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this blog?")) return;
        const res = await dispatch(deleteBlog(id));
        if (res?.meta?.requestStatus === "fulfilled" && res?.payload?.success) {
            dispatch(getAllBlogs());
        }
    };

    const handleEdit = (b) => {
        navigate("/blog/create", { state: { initialBlogData: { newBlog: false, ...b } } });
    };

    const handleView = (b) => {
        navigate("/blog/description", { state: { ...b } });
    };

    const toggleLike = (id) => {
        setLocalLikes((s) => {
            const cur = s[id] || 0;
            return { ...s, [id]: cur + 1 };
        });
    };

    return (
        <Layout>
            <div className="min-h-[90vh] p-6 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar actions */}
                        <aside className="w-full md:w-64 bg-white/5 rounded-xl p-4 space-y-4">
                            <h2 className="text-lg font-semibold">Blog Dashboard</h2>
                            <nav className="flex flex-col gap-2">
                                <button className="text-left px-3 py-2 rounded hover:bg-white/10">🏠 Overview</button>
                                <button
                                    onClick={() => navigate("/blog/create")}
                                    className="px-3 py-1 rounded-md bg-yellow-500 text-black font-semibold"
                                >
                                    Create Blog
                                </button>

                                <button onClick={() => document.getElementById('my-blogs')?.scrollIntoView({ behavior: 'smooth' })} className="text-left px-3 py-2 rounded hover:bg-white/10">📚 My Blogs</button>
                                <button className="text-left px-3 py-2 rounded hover:bg-white/10">❤️ Liked Blogs</button>
                                <button className="text-left px-3 py-2 rounded hover:bg-white/10">⚙️ Settings</button>
                            </nav>
                        </aside>

                        {/* Main column */}
                        <main className="flex-1 space-y-6">
                            {/* Top header */}
                            {/* <header className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search blogs by title, tag or category" className="px-3 py-2 rounded-lg bg-white/5 placeholder:text-gray-300" />
                                        <button onClick={() => setQuery("")} className="px-3 py-2 rounded bg-zinc-700">Clear</button>
                                    </form>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black">U</div>
                                </div>
                            </header> */}

                            {/* Create blog card */}
                            {/* <section className="bg-white/3 p-4 rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold mb-3">Create / Write a blog</h3>
                                <div className="space-y-3">
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your blog title..." className="w-full px-3 py-3 text-lg font-semibold rounded bg-white/5" />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded bg-white/5">
                                            <option value="">Select category</option>
                                            {TAG_OPTIONS.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>

                                        <div className="col-span-2 flex items-center gap-3">
                                            <input type="file" accept="image/*" onChange={handleThumbnail} />
                                            <div className="flex gap-2 flex-wrap">
                                                {TAG_OPTIONS.map((t) => (
                                                    <button key={t} onClick={() => handleToggleTag(t)} className={`px-2 py-1 rounded text-sm ${selectedTags.includes(t) ? 'bg-indigo-600 text-black' : 'bg-white/5'}`}>{t}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose max-w-full bg-white rounded p-2 text-black">
                                        <div ref={quillRef} style={{ minHeight: 200 }} />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => publish('published')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-black font-semibold"><HiOutlineCheck /> Publish</button>
                                        <button onClick={() => publish('draft')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-black"><HiOutlineSave /> Save as Draft</button>
                                        <button onClick={() => { setTitle(''); setCategory(''); setSelectedTags([]); setThumbnail(null); if (quill) quill.setText(''); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600"><HiOutlineX /> Cancel</button>
                                    </div>
                                </div>
                            </section> */}

                            {/* <button
                                onClick={() => navigate("/blog/create")}
                                className="px-3 py-1 rounded-md bg-yellow-500 text-black font-semibold"
                            >
                                Create Blog
                            </button> */}

                            {/* My Blogs */}
                            <section id="my-blogs">
                                <h3 className="text-xl font-semibold mb-4">My Blogs</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filtered.length === 0 ? (
                                        <div className="col-span-full text-center text-zinc-300 p-6 bg-white/5 rounded">No blogs found</div>
                                    ) : (
                                        filtered.map((b) => (
                                            <motion.div whileHover={{ y: -6 }} key={b._id} className="bg-white/4 rounded-lg p-4 shadow-md relative">
                                                <div className="h-36 mb-3 rounded overflow-hidden bg-zinc-800 flex items-center justify-center">
                                                    {b?.thumbnail?.secure_url ? (
                                                        <img src={b.thumbnail.secure_url} alt="thumb" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-zinc-400">No image</div>
                                                    )}
                                                </div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-lg line-clamp-2">{b.title}</h4>
                                                        <p className="text-sm text-zinc-400">{new Date(b.createdAt || b?.createdAt || Date.now()).toLocaleDateString()}</p>
                                                        <div className="flex gap-2 items-center mt-2">
                                                            <span className="px-2 py-1 text-xs rounded bg-white/5">{b?.category?.name || b?.category || 'General'}</span>
                                                            {(b?.tags || []).slice(0, 3).map((t) => (<span key={t} className="px-2 py-1 text-xs rounded bg-white/5">{t}</span>))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="text-sm text-zinc-300">{b.status || 'published'}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleEdit(b)} className="px-2 py-1 rounded bg-yellow-500 text-black"><AiOutlineEdit /></button>
                                                            <button onClick={() => handleView(b)} className="px-2 py-1 rounded bg-emerald-500 text-black"><AiOutlineEye /></button>
                                                            <button onClick={() => handleDelete(b._id)} className="px-2 py-1 rounded bg-red-500 text-white"><AiOutlineDelete /></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3 text-sm text-zinc-300">
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => toggleLike(b._id)} className="px-2 py-1 rounded bg-white/5">👍 {(b.likes || 0) + (localLikes[b._id] || 0)}</button>
                                                        <button onClick={() => handleView(b)} className="px-2 py-1 rounded bg-white/5">💬 {(b.comments?.length) || 0}</button>
                                                    </div>
                                                    <div className="text-xs text-zinc-400">Views: {b.views || 0}</div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserDashboard;
