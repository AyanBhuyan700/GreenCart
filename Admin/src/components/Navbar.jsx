import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex items-center justify-between px-6 md:px-10 border-b border-slate-200 py-3.5 bg-white shadow-xs sticky top-0 z-50">
                <a href="/order" className="flex items-center gap-2 group">
                    <img alt="GreenCart Admin Logo" className="cursor-pointer w-32 md:w-36 transition-transform group-hover:scale-105" src="/images/logo.svg" />
                    <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Admin Hub
                    </span>
                </a>
                <div className="flex items-center gap-4 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold text-slate-800">Hi, Store Admin</span>
                    </div>
                    <button className="border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-full text-xs font-semibold px-4 py-1.5 transition-all shadow-xs cursor-pointer" onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/adminLogin");
                    }}>Logout</button>
                </div>
            </div>
        </>
    )
}

export default Navbar;
