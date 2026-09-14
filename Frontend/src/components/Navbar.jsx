import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from "../context/ShopContext";

function Navbar() {
    const url = window.location.hostname === "localhost"
        ? "http://localhost:5174/order"
        : "https://green-cart-admin.vercel.app/AdminLogin";
    const token = localStorage.getItem("token");
    const { getCartCount, products, role, setRole } = useContext(ShopContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const currentRole = role || localStorage.getItem("role") || "user";
    const isAdmin = currentRole === "admin" || localStorage.getItem("isAdmin") === "true";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("isAdmin");
        if (setRole) setRole("user");
        navigate("/login");
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/allproduct?search=${search}`);
        }
    };


    return (
        <>
            <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white z-50 relative">
                <Link to={"/"}>
                    <img src="/images/logo.svg" alt="Logo" className="cursor-pointer w-28 md:w-36" />
                </Link>

                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    <img src="/images/menu.png" alt="menu" className="w-6 h-6" />
                </button>

                <div className="hidden md:flex items-center gap-6">
                    {isAdmin && (
                        <Link to={url} target="_blank" className="border border-gray-300 px-3 py-1 rounded-full text-xs opacity-80 hover:bg-gray-50 transition">Seller Dashboard</Link>
                    )}
                    <Link to={"/"} className="text-[#364153] text-base font-medium">Home</Link>
                    <Link to={"/allproduct"} className="text-[#364153] text-base">All Product</Link>

                    <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" placeholder="Search products" type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch} />
                        <img className="w-4 h-4" alt="search" src="/images/search.svg" />
                    </div>

                    <div className="relative cursor-pointer">
                        <Link to="/cart">
                            <img src="/images/cart.svg" className="w-6 opacity-80" />
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-[#4fbf8b] w-4.5 h-4.5 rounded-full">{getCartCount()}</button>
                        </Link>
                    </div>

                    <div className="relative group">
                        <img
                            src="/images/profile.png"
                            className="w-10 cursor-pointer"
                            onClick={() => !token && navigate("/login")}
                            alt="profile"
                        />
                        <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
                            {isAdmin && (
                                <li className="p-1.5 pl-3 hover:bg-[#edf8f3] cursor-pointer text-[#4fbf8b] font-medium" onClick={() => window.open(url, "_blank")}>Seller Dashboard</li>
                            )}
                            <li className="p-1.5 pl-3 hover:bg-[#edf8f3] cursor-pointer" onClick={() => navigate("/orders")}>My Orders</li>
                            {token ? (
                                <li className="p-1.5 pl-3 hover:bg-[#edf8f3] cursor-pointer" onClick={handleLogout}>Logout</li>
                            ) : (
                                <li className="p-1.5 pl-3 hover:bg-[#edf8f3] cursor-pointer" onClick={() => navigate("/login")}>Login</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden px-6 py-4 space-y-4 bg-white border-b border-gray-300">
                    {isAdmin && (
                        <Link to={url} target="_blank" className="block border border-gray-300 px-3 py-1 rounded-full text-xs opacity-80 w-fit">Seller Dashboard</Link>
                    )}
                    <Link to={"/"} className="block text-[#364153] text-base font-medium">Home</Link>
                    <Link to={"/allproduct"} className="block text-[#364153] text-base">All Product</Link>
                    <Link to="/cart" className="flex items-center gap-2">
                        <img src="/images/cart.svg" className="w-5" alt="cart" />
                        <span>Cart ({getCartCount()})</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <img
                            src="/images/profile.png"
                            className="w-8 cursor-pointer"
                            alt="profile"
                            onClick={() => {
                                if (!token) navigate("/login");
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2 text-sm pl-4 pt-2 border-t border-gray-100">
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    window.open(url, "_blank");
                                }}
                                className="text-left text-[#4fbf8b] font-medium"
                            >
                                Seller Dashboard
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/orders");
                            }}
                            className="text-left hover:text-[#4fbf8b] transition font-medium"
                        >
                            My Orders
                        </button>
                        {token ? (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleLogout();
                                }}
                                className="text-left hover:text-red-500 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/login");
                                }}
                                className="text-left hover:text-[#4fbf8b] transition"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
