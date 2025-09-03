import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { login } from "../Redux/authSlice";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // function to handle the user input
  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setLoginData((s) => ({ ...s, [name]: value }));
  };

  // function to login
  const handleLogin = async (event) => {
    event.preventDefault();

    // checking the empty fields
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      // calling login action
      const res = await dispatch(login(loginData));

      // redirect to home page if true
      if (res?.payload?.success) navigate("/");

      // clearing the login inputs
      setLoginData({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = () => setLoginData({ email: "test@gmail.com", password: "Test@123" });

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md bg-gradient-to-br from-white/4 to-white/6 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-zinc-400">Sign in to continue to your dashboard</p>
            </div>
            <div className="text-xs text-zinc-400">Secure · Fast</div>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col">
              <label className="text-sm text-zinc-300 mb-1">Email</label>
              <input
                required
                type="email"
                name="email"
                id="email"
                placeholder="you@company.com"
                className="w-full rounded-lg px-4 py-3 bg-black/20 text-white outline-none border border-transparent focus:border-yellow-400"
                value={loginData.email}
                onChange={handleUserInput}
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm text-zinc-300 mb-1">Password</label>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full rounded-lg px-4 py-3 bg-black/20 text-white outline-none border border-transparent focus:border-yellow-400 pr-10"
                value={loginData.password}
                onChange={handleUserInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-zinc-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-5 py-2 rounded-lg font-semibold shadow-md"
              >
                {loading ? "Signing in..." : "Sign in"}
              </motion.button>

              <button
                type="button"
                onClick={guestLogin}
                className="text-sm text-zinc-300 underline hover:text-white"
              >
                Guest login
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <Link to="/forgetpassword" className="hover:text-white">Forgot password?</Link>
              <div>
                Don't have an account? <Link to="/signup" className="text-yellow-400 font-medium">Sign up</Link>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </Layout>
  );
};

export default Login;