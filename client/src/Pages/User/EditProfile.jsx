import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { getUserData, updateProfile } from "../../Redux/authSlice";
import { motion } from "framer-motion";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const authUser = useSelector((state) => state?.auth?.data) || {};

  const [loading, setLoading] = useState(false);
  const [previewImage, setImagePreview] = useState(
    authUser?.avatar?.secure_url || ""
  );
  const [data, setData] = useState({
    fullName: authUser?.fullName || "",
    avatar: undefined,
    userID: authUser?._id || "",
    userRole: authUser?.role || "user",
  });

  useEffect(() => {
    // keep initial values in sync if authUser loads after mount
    setData((d) => ({
      ...d,
      fullName: authUser?.fullName || d.fullName,
      userID: authUser?._id || d.userID,
      userRole: authUser?.role || d.userRole,
    }));
    if (authUser?.avatar?.secure_url)
      setImagePreview(authUser.avatar.secure_url);
  }, [authUser]);

  // image change
  const getImage = (event) => {
    const uploadedImage = event.target.files?.[0];
    if (uploadedImage) {
      setData((prev) => ({ ...prev, avatar: uploadedImage }));
      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage);
      reader.onload = () => setImagePreview(reader.result);
    }
  };

  const removeImage = () => {
    setData((prev) => ({ ...prev, avatar: undefined }));
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!data.fullName || data.fullName.trim().length < 3) {
      toast.error("Please enter a valid name (at least 3 characters)");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", data.fullName.trim());
      if (data.avatar) formData.append("avatar", data.avatar);
      formData.append("userRole", data.userRole);

      const payload = [data.userID, formData];
      const res = await dispatch(updateProfile(payload));

      if (res?.payload?.success) {
        toast.success("Profile updated");
        await dispatch(getUserData());
        navigate("/user/profile");
      } else {
        toast.error(res?.payload?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.form
          onSubmit={handleFormSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-xl bg-white/5 backdrop-blur-md dark:bg-zinc-900/60 rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Edit Profile
            </h2>
            <Link
              to="/user/profile"
              className="text-gray-300 hover:text-white flex items-center gap-2"
            >
              <AiOutlineArrowLeft /> Back
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="avatar preview"
                  className="w-36 h-36 rounded-full object-cover ring-4 ring-white/10 shadow-lg"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-300 flex items-center justify-center text-black font-bold text-3xl shadow-inner">
                  {data.fullName
                    ? data.fullName.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}

              <div className="absolute -bottom-2 right-0 flex gap-2">
                <label
                  htmlFor="image_uploads"
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full cursor-pointer text-sm"
                >
                  Change
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <BsTrash /> Remove
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                onChange={getImage}
                className="hidden"
                type="file"
                id="image_uploads"
                accept="image/*"
              />
            </div>

            <div className="flex-1 w-full">
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">
                  Full name
                </label>
                <input
                  required
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-transparent focus:border-yellow-400 outline-none text-white"
                  placeholder="Your full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Role</label>
                <input
                  name="userRole"
                  value={data.userRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-transparent outline-none text-white"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-3 rounded-lg shadow"
                >
                  {loading ? "Saving..." : "Update Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/user/profile")}
                  className="flex-1 border border-zinc-700 text-white px-4 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Tip: Use a clear profile photo to help readers recognize you.
          </p>
        </motion.form>
      </div>
    </Layout>
  );
};

export default EditProfile;