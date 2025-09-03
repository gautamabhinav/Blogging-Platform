import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { BsPersonCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAccount } from "../Redux/authSlice";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // for user input
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  // function to set the signup data
  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  // function to handle the image upload
  const getImage = (event) => {
    event.preventDefault();
    const uploadedImage = event.target.files?.[0];
    if (uploadedImage) {
      setSignupData((s) => ({ ...s, avatar: uploadedImage }));
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setImagePreview(this.result);
      });
    }
  };

  const removeImage = () => {
    setSignupData((s) => ({ ...s, avatar: "" }));
    setImagePreview("");
  };

  // password strength (simple heuristic)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", score: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
    return { label: labels[Math.min(score, labels.length - 1)], score };
  };

  // function to create account
  const createNewAccount = async (event) => {
    event.preventDefault();

    // checking the empty fields
    if (
      !signupData.avatar ||
      !signupData.email ||
      !signupData.fullName ||
      !signupData.password
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    // checking the name field length
    if (signupData.fullName.length < 5) {
      toast.error("Name should be atleast of 5 characters");
      return;
    }

    // email validation using regex
    if (
      !signupData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      toast.error("Invalid email id");
      return;
    }

    // password validation using regex
    if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error(
        "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    // creating the form data from the existing data
    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // calling create account action
    const res = await dispatch(createAccount(formData));

    // redirect to login page if true
    if (res.payload?.success) navigate("/login");

    // clearing the signup inputs
    setSignupData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });
    setImagePreview("");
  };

  const strength = getPasswordStrength(signupData.password);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.form
          onSubmit={createNewAccount}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gradient-to-br from-white/5 to-white/3 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white"
        >
          <div className="flex flex-col items-center gap-3 mb-4">
            <label htmlFor="image_uploads" className="cursor-pointer relative">
              {previewImage ? (
                <img
                  className="w-24 h-24 rounded-full object-cover border-4 border-zinc-900"
                  src={previewImage}
                  alt="preview image"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <BsPersonCircle className="text-5xl" />
                </div>
              )}

              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -right-2 -bottom-2 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  Remove
                </button>
              )}
            </label>
            <input
              onChange={getImage}
              className="hidden"
              type="file"
              id="image_uploads"
              name="image_uploads"
              accept=".jpg, .jpeg, .png"
            />

            <h1 className="text-center text-2xl font-bold">
              Create your account
            </h1>
            <p className="text-sm text-zinc-400">
              Join the community — publish and connect.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-300">Name</label>
              <input
                required
                type="name"
                name="fullName"
                id="fullName"
                placeholder="Enter your name"
                className="bg-transparent px-3 py-2 border rounded-lg focus:border-yellow-400 outline-none"
                value={signupData.fullName}
                onChange={handleUserInput}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <input
                required
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="bg-transparent px-3 py-2 border rounded-lg focus:border-yellow-400 outline-none"
                value={signupData.email}
                onChange={handleUserInput}
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent px-3 py-2 border rounded-lg focus:border-yellow-400 outline-none pr-10"
                  value={signupData.password}
                  onChange={handleUserInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2 text-zinc-400"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>

              <div className="mt-2 h-2 w-full bg-zinc-800 rounded overflow-hidden">
                <div
                  className={`h-full ${strength.score >= 4
                      ? "bg-emerald-400"
                      : strength.score >= 3
                        ? "bg-amber-400"
                        : "bg-red-500"
                    } transition-width`}
                  style={{ width: `${(strength.score / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">{strength.label}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg font-semibold shadow-md"
            >
              Create Account
            </motion.button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to={"/login"} className="text-yellow-400 font-medium">
                Login
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </Layout>
  );
};

export default Signup;