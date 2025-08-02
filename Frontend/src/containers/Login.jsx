import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

function Login() {
  const url = "https://greencart-backend-lf22.onrender.com";
  const [form, setForm] = useState({ email: "", password: "" });
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
          <input
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]"
            required
            type="password"
            value={form.password}
            name="password"
            onChange={changeHandler}
          />
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
