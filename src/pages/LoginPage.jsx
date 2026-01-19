import React, { useState } from "react";
import { Mail, Lock, User, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { api } from "../services/api";

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role
    school: "School of Technology", // Default school
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        // We only send email and password
        const data = await api.login({
          email: formData.email,
          password: formData.password,
        });
        onLogin(data);
      } else {
        // --- REGISTER LOGIC ---
        const data = await api.register(formData);
        // Automatically login after register, or ask user to login
        // Here we just pass the user data to log them in immediately
        onLogin(data);
      }
    } catch (err) {
      // This catches the 401 error and displays the message from server
      console.error("Auth Error:", err);
      setError(err.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
        {/* LEFT SIDE: FORM */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-slate-500">
              {isLogin ? "Please enter your details." : "Join BookIt today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div className="relative animate-in slide-in-from-left-2">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Register Extra Fields */}
            {!isLogin && (
              <div className="space-y-4 animate-in slide-in-from-left-2">
                {/* Role Selection */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "student" })
                    }
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === "student" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "faculty" })
                    }
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === "faculty" ? "bg-white shadow text-purple-600" : "text-slate-400"}`}
                  >
                    Faculty
                  </button>
                </div>

                {/* School Dropdown */}
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <select
                    name="school"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    value={formData.school}
                    onChange={handleChange}
                  >
                    <option>School of Technology</option>
                    <option>School of Business</option>
                    <option>School of Arts & Design</option>
                    <option>School of Architecture</option>
                    <option>School of Sciences</option>
                  </select>
                </div>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-medium text-center border border-red-100 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all 
                ${isLogin ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-slate-900 hover:bg-slate-800 shadow-slate-300"}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="ml-2 font-bold text-indigo-600 hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>

        {/* RIGHT SIDE: IMAGE/DECOR */}
        <div
          className={`hidden md:block w-1/2 p-12 text-white flex flex-col justify-between transition-colors duration-500 ${isLogin ? "bg-indigo-600" : "bg-slate-900"}`}
        >
          <div>
            <div className="text-3xl font-bold mb-2">🎓 BookIt</div>
            <p className="opacity-70">University Appointment System</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              {isLogin
                ? "Manage your academic schedule effortlessly."
                : "Join the community of efficient learning."}
            </h2>
            <p className="opacity-80 text-lg">
              Connect with faculty, book appointments, and track your attendance
              in one place.
            </p>
          </div>

          <div className="text-sm opacity-50">© 2025 Woxsen University</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
