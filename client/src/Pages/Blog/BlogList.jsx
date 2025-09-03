import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogCard from "../../Components/BlogCard";
import Layout from "../../Layout/Layout";
import { getAllBlogs } from "../../Redux/blogSlice";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogsData = useSelector((state) => state.blog.blogsData) || [];
  // local UI state
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await dispatch(getAllBlogs());
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const categories = useMemo(() => {
    const set = new Set();
    blogsData.forEach((b) => {
      const name = b?.category?.name || b?.category || "Uncategorized";
      if (name) set.add(name);
    });
    return ["", ...Array.from(set)];
  }, [blogsData]);

  const filtered = useMemo(() => {
    let list = blogsData || [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((b) => {
        return (
          (b?.title || "").toLowerCase().includes(q) ||
          (b?.content || "").toLowerCase().includes(q) ||
          (b?.author || "").toLowerCase().includes(q)
        );
      });
    }
    if (category) {
      list = list.filter((b) => (b?.category?.name || b?.category || "").toString() === category);
    }
    if (sort === "newest") {
      list = list.slice().sort((a, b) => new Date(b?.createdAt || b?.createdAt) - new Date(a?.createdAt || a?.createdAt));
    } else if (sort === "oldest") {
      list = list.slice().sort((a, b) => new Date(a?.createdAt || a?.createdAt) - new Date(b?.createdAt || b?.createdAt));
    }
    return list;
  }, [blogsData, query, category, sort]);

  return (
    <Layout>
      <div className="min-h-[90vh] pt-12 px-6 md:px-20 flex flex-col gap-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-semibold">
            Explore the blogs made by <span className="font-bold text-yellow-500">People Experts</span>
          </h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, author or content..."
                className="pl-10 pr-3 py-2 w-full bg-zinc-800 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c || "all"} value={c}>
                  {c || "All Categories"}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-800 rounded-lg p-4 h-[430px]"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-12">
            <p className="text-xl">No blogs found.</p>
            <p className="text-gray-400 max-w-lg text-center">Try changing your search terms or create the first blog.</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/blog/create', { state: { initialBlogData: { newBlog: true } } })}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md font-semibold"
              >
                Create Blog
              </button>
              <button onClick={() => { setQuery(''); setCategory(''); }} className="px-4 py-2 border rounded-md">Reset</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {filtered.map((element) => (
              <div key={element?._id} className="transform hover:-translate-y-1 transition-all duration-300">
                <BlogCard data={element} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogList;
