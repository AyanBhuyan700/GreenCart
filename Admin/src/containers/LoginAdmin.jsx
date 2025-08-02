import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function LoginAdmin() {
    const url = "https://greencart-backend-lf22.onrender.com";
    const [form, setForm] = useState({ email: "admin@greencart.com", password: "admin12345" });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    };

    function adminLogin() {
        try {
            axios.post(`${url}/api/user/admin`, form).then((response) => {
                toastr.success("Login successful!", "Success");

                const token = response.data.token;
                localStorage.setItem("token", token);
                navigate('/add');
            })
        } catch (err) {
            toastr.error("Login failed!", "Error");
        }
    }

    function onAdminSubmit(e) {
        e.preventDefault();
        adminLogin();
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4">

                <form className="flex items-center text-sm text-gray-600 mt-16" onSubmit={onAdminSubmit}>
                    <div className="flex flex-col gap-4 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200 bg-white">
                        <p className="text-2xl font-medium m-auto"><span className="text-[#4fbf8b]">Admin</span> Panel</p>
                        <div className="w-full">
                            <p>Email</p>
                            <input placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b] cursor-not-allowed" disabled type="email" name="email" onChange={changeHandler} value={form.email}></input>
                        </div>
                        <div className="w-full">
                            <p>Password</p>
                            <input placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b] cursor-not-allowed" disabled type="password" name="password" onChange={changeHandler} value={form.password}></input>
                        </div>
                        <button className="bg-[#4fbf8b] text-white w-full py-2 rounded-md cursor-pointer">Login</button>
                    </div>
                </form >
            </div>
        </>
    )
}

export default LoginAdmin;
