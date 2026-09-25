import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Loader2, AlertCircle } from "lucide-react";

function Login() {
  const { url, setToken, setRole, setUser, setProfileImage, fetchUserProfile } = useContext(ShopContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [takingLonger, setTakingLonger] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setTakingLonger(true);
      }, 2500);
    } else {
      setTakingLonger(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const changeHandler = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  async function loginUser() {
    setIsLoading(true);
    setTakingLonger(false);
    try {
      const response = await axios.post(`${url}/api/user/login`, form);
      toastr.success("Login successful!", "Success");

      const token = response.data.token;
      localStorage.setItem("token", token);
      if (setToken) setToken(token);

      const userRole = response.data.role || (form.email === "admin@greencart.com" || form.email.toLowerCase().includes("admin") ? "admin" : "user");
      localStorage.setItem("role", userRole);
      if (setRole) setRole(userRole);

      const userData = response.data.user || {
        email: form.email,
        username: form.email.split("@")[0],
        role: userRole
      };
      localStorage.setItem("user", JSON.stringify(userData));
      if (setUser) setUser(userData);

      if (userData.image) {
        localStorage.setItem("userImage", userData.image);
        if (setProfileImage) setProfileImage(userData.image);
      }

      // Fetch latest profile from database if available
      if (fetchUserProfile) {
        fetchUserProfile().catch(() => {});
      }

      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || (err.message === "Network Error" ? "Server is starting up, please try again in a few seconds." : "Login failed!");
      if (errorMessage === "Invalid email or password") {
        toastr.error(errorMessage, "Error");
        resetForm();
      } else {
        toastr.error(errorMessage, "Error");
      }
    } finally {
      setIsLoading(false);
      setTakingLonger(false);
    }
  }

  function resetForm() {
    setForm({ email: "", password: "" });
  }

  function onLoginSubmit(e) {
    e.preventDefault();
    if (isLoading) return;
    loginUser();
  }

  return (
    <form
      className="flex items-center mt-16 px-4 text-sm text-gray-600"
      onSubmit={onLoginSubmit}
    >
      <div className="flex flex-col gap-4 m-auto items-start p-8 py-10 w-full max-w-md rounded-2xl shadow-xl border border-gray-100 bg-white relative overflow-hidden">
        {/* Top Loading Progress Line */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-100 overflow-hidden">
            <div className="h-full bg-emerald-500 animate-pulse w-full"></div>
          </div>
        )}

        <div className="w-full text-center">
          <p className="text-2xl font-semibold text-slate-800">
            Welcome <span className="text-[#4fbf8b]">Back</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Sign in to your GreenCart account</p>
        </div>

        {/* Cold-start Server Notification Banner */}
        {takingLonger && (
          <div className="w-full flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-800 text-xs animate-in fade-in duration-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5 animate-bounce" />
            <div>
              <p className="font-semibold text-amber-900">Connecting to server...</p>
              <p className="text-amber-700/90 text-[11px] mt-0.5">
                Our free-tier server is spinning up. Thank you for your patience!
              </p>
            </div>
          </div>
        )}

        <div className="w-full">
          <label className="text-xs font-medium text-slate-700">Email Address</label>
          <input
            placeholder="name@example.com"
            className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 outline-[#4fbf8b] focus:border-[#4fbf8b] focus:ring-2 focus:ring-[#4fbf8b]/20 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
            required
            type="email"
            value={form.email}
            name="email"
            disabled={isLoading}
            onChange={changeHandler}
          />
        </div>

        <div className="w-full">
          <label className="text-xs font-medium text-slate-700">Password</label>
          <div className="relative mt-1">
            <input
              placeholder="Enter your password"
              className="border border-gray-200 rounded-lg w-full p-2.5 pr-10 outline-[#4fbf8b] focus:border-[#4fbf8b] focus:ring-2 focus:ring-[#4fbf8b]/20 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              name="password"
              disabled={isLoading}
              onChange={changeHandler}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-between text-xs pt-1">
          <span className="text-slate-500">Need an account?</span>
          <Link to={"/register"} className="text-[#4fbf8b] hover:text-emerald-700 font-medium transition">
            Create account
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#4fbf8b] hover:bg-[#43a678] text-white w-full py-2.5 px-4 rounded-xl font-medium shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default Login;
