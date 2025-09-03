import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { changePassword } from "../../Redux/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userPassword, setUserPassword] = useState({ oldPassword: "", newPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // function to handle input box change
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setUserPassword({ ...userPassword, [name]: value });
  };

  // Local heuristic to compute password strength score 0..4
  const computeStrength = (pw = "") => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    // normalize to 0-4 scale
    if (score <= 1) return 0;
    if (score === 2) return 1;
    if (score === 3) return 2;
    if (score === 4) return 3;
    return 4;
  };

  const strengthScore = computeStrength(userPassword.newPassword || "");
  const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-emerald-400", "bg-green-500"];

  // function to handle form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!userPassword.oldPassword || !userPassword.newPassword) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!userPassword.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
      toast.error("Password must contain uppercase, lowercase, number and be 6-20 chars");
      return;
    }

    try {
      setSubmitting(true);
      const res = await dispatch(changePassword(userPassword));

      setUserPassword({ oldPassword: "", newPassword: "" });

      if (res?.payload?.success) {
        toast.success("Password changed");
        navigate("/user/profile");
      } else {
        toast.error(res?.payload?.message || "Failed to change password");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <form onSubmit={handleFormSubmit} className="w-full max-w-md bg-white/5 dark:bg-zinc-900/60 rounded-2xl p-6 shadow-2xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
            <Link to="/user/profile" className="text-gray-300 hover:text-white flex items-center gap-2"><AiOutlineArrowLeft /> Back</Link>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Old Password</label>
            <div className="relative">
              <input type={showOld ? "text" : "password"} name="oldPassword" value={userPassword.oldPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-transparent focus:border-yellow-400 outline-none text-white" placeholder="Enter current password" />
              <button type="button" onClick={() => setShowOld((s) => !s)} className="absolute right-2 top-2 text-gray-300">{showOld ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</button>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm text-gray-300 mb-1">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} name="newPassword" value={userPassword.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-lg bg-black/20 border border-transparent focus:border-yellow-400 outline-none text-white" placeholder="Enter new password" />
              <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-2 top-2 text-gray-300">{showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</button>
            </div>
            <div className="mt-2 h-2 w-full bg-zinc-800 rounded overflow-hidden">
              <div className={`h-full ${strengthColors[strengthScore]} transition-width`} style={{ width: `${(strengthScore + 1) * 20}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Strength: {strengthLabels[strengthScore]}</p>
          </div>

          <div className="mt-4 flex gap-3">
            <button disabled={submitting} type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold">{submitting ? "Saving..." : "Change Password"}</button>
            <button type="button" onClick={() => navigate('/user/profile')} className="flex-1 border border-zinc-700 text-white px-4 py-2 rounded-lg">Cancel</button>
          </div>

          <p className="text-xs text-gray-400 mt-4">Password must be 6-20 characters and include uppercase, lowercase, and a number.</p>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePassword;