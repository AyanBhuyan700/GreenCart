import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from "../context/ShopContext";

function Navbar() {
    const url = "https://green-cart-admin.vercel.app/AdminLogin";
    const token = localStorage.getItem("token");
    const { getCartCount } = useContext(ShopContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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
                    <Link to={url} target="_blank" className="border border-gray-300 px-3 py-1 rounded-full text-xs opacity-80">Seller Dashboard</Link>
                    <Link to={"/"} className="text-[#364153] text-base font-medium">Home</Link>
                    <Link to={"/allproduct"} className="text-[#364153] text-base">All Product</Link>

                    <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" placeholder="Search products" type="text" />
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
                        {token && (
                            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                                <li className="p-1.5 pl-3 hover:bg-[#edf8f3] cursor-pointer">My Orders</li>
                                <li className="p-1.5 pl-3 hover:bg-[#edf8f3] cursor-pointer" onClick={handleLogout}>Logout</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden px-6 py-4 space-y-4 bg-white border-b border-gray-300">
                    <Link to={url} target="_blank" className="block border border-gray-300 px-3 py-1 rounded-full text-xs opacity-80">Seller Dashboard</Link>
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

                    {token && (
                        <div className="flex flex-col gap-2 text-sm pl-10">
                            <button
                                onClick={() => navigate("/orders")}
                                className="text-left hover:text-[#4fbf8b] transition"
                            >
                                My Orders
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-left hover:text-[#4fbf8b] transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Navbar;
