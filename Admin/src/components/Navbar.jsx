import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <a href="/" data-discover="true">
                    <img alt="Logo" className="cursor-pointer w-34 md:w-38" src="images/logo.svg" />
                </a>
                <div className="flex items-center gap-5 text-gray-500 relative">
                    <p>Hi! Admin</p>
                    <button className="border rounded-full text-sm px-4 py-1" onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/adminLogin")
                    }}>Logout</button>
                </div>
            </div>
        </>
    )
}

export default Navbar;
