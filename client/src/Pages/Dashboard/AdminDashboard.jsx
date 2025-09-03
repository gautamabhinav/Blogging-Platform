import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
// import { deleteCourse, getAllCourses } from "../../Redux/courseSlice";
import { getStatsData } from "../../Redux/statSlice";
// import { getPaymentRecord } from "../../Redux/razorpaySlice";
import { deleteBlog, getAllBlogs } from "../../Redux/blogSlice";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const StatCard = ({
  title,
  value,
  icon,
  color = "from-yellow-400 to-yellow-500",
}) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br ${color} text-black shadow-lg`}
    >
      <div>
        <div className="text-xs font-medium opacity-90">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
      <div className="text-4xl opacity-90">{icon}</div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ blogs: 0, authors: 0, categories: 0 });
  const [animated, setAnimated] = useState({ b: 0, a: 0, c: 0 });

  // getting the blogs data from redux toolkit store
  const myBlogs = useSelector((state) => state.blog.blogsData) || [];

  useEffect(() => {
    (async () => {
      await dispatch(getAllBlogs());
      // await dispatch(getStatsData());
      // await dispatch(getPaymentRecord());
    })();
  }, []);

  // compute derived counts when myBlogs changes
  useEffect(() => {
    const totalBlogs = myBlogs?.length || 0;
    const authors = new Set(
      (myBlogs || []).map((b) => b?.author || "")
    ).size;
    // more robust: count unique non-empty authors
    const uniqueAuthors = new Set(
      (myBlogs || []).map((b) => b?.author).filter(Boolean)
    ).size;
    const uniqueCategories = new Set(
      (myBlogs || []).map((b) => b?.category?.name).filter(Boolean)
    ).size;

    setCounts({
      blogs: totalBlogs,
      authors: uniqueAuthors,
      categories: uniqueCategories,
    });

    // animate counts (simple requestAnimationFrame counter)
    const duration = 700; // ms
    const start = performance.now();
    const startVals = { b: animated.b || 0, a: animated.a || 0, c: animated.c || 0 };

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setAnimated({
        b: Math.floor(startVals.b + (totalBlogs - startVals.b) * t),
        a: Math.floor(startVals.a + (uniqueAuthors - startVals.a) * t),
        c: Math.floor(startVals.c + (uniqueCategories - startVals.c) * t),
      });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myBlogs]);

  // function to handle the course delete
  const handleBlogDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the blog?")) {
      const res = await dispatch(deleteBlog(id));

      // fetching the new updated data for the course
      if (res?.payload?.success) {
        await dispatch(getAllBlogs());
      }
    }
  };

  // const userData = {
  //   labels: ["Registered User", "Enrolled User"],
  //   datasets: [
  //     {
  //       label: "User Details",
  //       // data: [allUsersCount, subscribedUsersCount],
  //       backgroundColor: ["#F59E0B", "#10B981"],
  //       borderColor: ["#F59E0B", "#10B981"],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  return (
    <Layout>
      <div className="min-h-[90vh] pt-6 pb-10 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-yellow-500">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(getAllBlogs())}
                className="px-3 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 transition"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/blog/create")}
                className="px-3 py-1 rounded-md bg-yellow-500 text-black font-semibold"
              >
                Create Blog
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total Blogs"
              value={animated.b}
              icon={<BsCollectionPlayFill />}
              color={"from-yellow-400 to-yellow-500"}
            />
            <StatCard
              title="Unique Authors"
              value={animated.a}
              icon={<FaUsers />}
              color={"from-emerald-300 to-emerald-400"}
            />
            <StatCard
              title="Categories"
              value={animated.c}
              icon={<FcSalesPerformance />}
              color={"from-sky-300 to-sky-400"}
            />
          </div>

          {/* Charts + Overview */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="w-full bg-gradient-to-br from-white/5 to-white/3 p-4 rounded-2xl border border-zinc-800 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">Blogs Overview</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left divide-y divide-zinc-700">
                  <thead className="text-zinc-300">
                    <tr>
                      <th className="py-2">S No.</th>
                      <th className="py-2">Preview</th>
                      <th className="py-2">Title</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Author</th>
                      <th className="py-2">Content</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {myBlogs?.map((element, index) => (
                      <motion.tr
                        key={element?._id}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="hover:bg-white/3"
                      >
                        <td className="py-3 align-top">{index + 1}</td>
                        <td className="py-2 align-top">
                          {element?.thumbnail?.secure_url ? (
                            <img
                              src={element.thumbnail.secure_url}
                              alt="thumb"
                              className="w-20 h-12 object-cover rounded-md border border-zinc-700"
                            />
                          ) : (
                            <div className="w-20 h-12 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-500">
                              No image
                            </div>
                          )}
                        </td>
                        <td className="py-3 align-top max-w-xs">
                          <div className="text-sm font-medium">{element?.title}</div>
                        </td>
                        <td className="py-3 align-top">
                          {element?.category?.name || element?.category}
                        </td>
                        <td className="py-3 align-top">{element?.author || "—"}</td>
                        <td className="py-3 align-top max-w-[22rem] overflow-hidden">
                          <div className="text-sm text-zinc-300 line-clamp-3">
                            {element?.content}
                          </div>
                        </td>
                        <td className="py-3 align-top flex gap-2">
                          <button
                            onClick={() =>
                              navigate("/blog/create", {
                                state: {
                                  initialBlogData: {
                                    newBlog: false,
                                    ...element,
                                  },
                                },
                              })
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 transition-all px-3 py-2 rounded-md text-black font-bold"
                          >
                            <MdOutlineModeEdit />
                          </button>

                          <button
                            onClick={() => handleBlogDelete(element._id)}
                            className="bg-red-500 hover:bg-red-600 transition-all px-3 py-2 rounded-md text-white font-bold"
                          >
                            <BsTrash />
                          </button>

                          <button
                            onClick={() =>
                              navigate("/blog/description", {
                                state: { ...element },
                              })
                            }
                            className="bg-green-500 hover:bg-green-600 transition-all px-3 py-2 rounded-md text-black font-bold"
                          >
                            <BsCollectionPlayFill />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;


