import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

function Login() {
  const url = "https://greencart-backend-lf22.onrender.com";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  async function loginUser() {
    try {
      const response = await axios.post(`${url}/api/user/login`, form);
      toastr.success("Login successful!", "Success");

      const token = response.data.token;
      localStorage.setItem("token", token);

      const userRole = response.data.role || (form.email === "admin@greencart.com" || form.email.toLowerCase().includes("admin") ? "admin" : "user");
      localStorage.setItem("role", userRole);

      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed!";
      if (errorMessage === "Invalid email or password") {
        toastr.error(errorMessage, "Error");
        resetForm();
      } else {
        toastr.error(errorMessage, "Error");
      }
    }
  }

  function resetForm() {
    setForm({ email: "", password: "" });
  }

  function onLoginSubmit(e) {
    e.preventDefault();
    loginUser();
  }

  return (
    <form
      className="flex items-center mt-20 text-sm text-gray-600"
      onSubmit={onLoginSubmit}
    >
      <div className="flex flex-col gap-4 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 bg-white">
        <p className="text-2xl font-medium m-auto">
          <span className="text-[#4fbf8b]">User</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]"
            required
            type="email"
            value={form.email}
            name="email"
            onChange={changeHandler}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <div className="relative mt-1">
            <input
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 pr-10 outline-[#4fbf8b]"
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              name="password"
              onChange={changeHandler}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
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
        <p className="flex justify-between">
          Create an account?{" "}
          <Link to={"/register"} className="text-[#4fbf8b]">
            click here
          </Link>
        </p>
        <button
          type="submit"
          className="bg-[#4fbf8b] text-white w-full py-2 rounded-md cursor-pointer"
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
