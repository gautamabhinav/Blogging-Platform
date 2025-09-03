import React, { useEffect, useMemo, useState, useRef } from "react";
import Layout from "../Layout/Layout";
import homePageMainImage from "../Assets/Images/homePageMainImage.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../Redux/blogSlice";
import BlogCard from "../Components/BlogCard";
import { HiOutlineSearch } from "react-icons/hi";
import { motion } from "framer-motion";

const Homepage = () => {
  const dispatch = useDispatch();
  const blogsData = useSelector((state) => state.blog?.blogsData || []);
  const [loading, setLoading] = useState(false);

  // hero search
  const [query, setQuery] = useState("");

  // featured carousel
  const [index, setIndex] = useState(0);
  const autoplay = useRef(null);

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

  const featured = useMemo(() => {
    // pick top 5 latest or fallback first 5
    const arr = Array.isArray(blogsData) ? blogsData.slice(0, 5) : [];
    return arr;
  }, [blogsData]);

  const recent = useMemo(() => {
    const arr = Array.isArray(blogsData) ? blogsData.slice(0, 6) : [];
    return arr;
  }, [blogsData]);

  useEffect(() => {
    if (featured.length === 0) return;
    autoplay.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4000);
    return () => clearInterval(autoplay.current);
  }, [featured.length]);

  const filteredRecent = useMemo(() => {
    if (!query.trim()) return recent;
    const q = query.toLowerCase();
    return recent.filter(
      (b) =>
        (b?.title || "").toLowerCase().includes(q) ||
        (b?.author || "").toLowerCase().includes(q)
    );
  }, [recent, query]);

  return (
    <Layout>
      <div className="pt-10 text-white flex flex-col gap-12 px-6 md:px-20">
        {/* HERO */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 shadow-lg">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Discover thoughtful writing from{" "}
              <span className="text-yellow-500">real people</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Read short essays, long-form pieces, and everything in between —
              curated for curiosity.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or author"
                  className="pl-10 pr-3 py-2 w-full bg-zinc-800 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="flex gap-3">
                <Link to="/blogs" className="inline-block">
                  <button className="bg-yellow-500 px-5 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">
                    Explore Blogs
                  </button>
                </Link>
                {/* <Link to="/blog/create" className="inline-block">
                  <button className="border border-yellow-500 px-5 py-2 rounded-md font-semibold hover:bg-yellow-500 hover:text-black transition">
                    Write
                  </button>
                </Link> */}
              </div>
            </div>

            <div className="mt-6 flex gap-6">
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {blogsData.length}
                </p>
                <p className="text-gray-300">Published posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.max(100, blogsData.length * 5)}
                </p>
                <p className="text-gray-300">Readers (est.)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-zinc-700">
              <img
                src={homePageMainImage}
                alt="home"
                className="object-cover w-full h-64 md:h-80"
              />
            </div>
          </motion.div>
        </div>

        {/* FEATURED CAROUSEL */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured picks</h2>

          {featured.length === 0 && loading ? (
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[22rem] h-[430px] bg-zinc-800 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="flex gap-6 overflow-hidden">
                {featured.map((b, i) => (
                  <motion.div
                    key={b?._id || i}
                    animate={{ x: (i - index) * 240 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="min-w-[22rem] max-w-[22rem]"
                  >
                    <BlogCard data={b} />
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 justify-center">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-3 h-3 rounded-full ${i === index ? "bg-yellow-400" : "bg-zinc-600"
                      }`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* RECENT / SEARCH RESULTS */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent posts</h2>
            <Link
              to="/blogs"
              className="text-yellow-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(filteredRecent.length === 0 && !loading) ? (
              <div className="col-span-full text-center text-gray-400">
                No posts found. Try a different search or create the first post.
              </div>
            ) : loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[430px] bg-zinc-800 animate-pulse rounded-lg"
                />
              ))
            ) : (
              filteredRecent.map((b) => (
                <div
                  key={b?._id}
                  className="transform hover:-translate-y-1 transition-all duration-300"
                >
                  <BlogCard data={b} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Homepage;
