import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Search, ShoppingBag, User, Menu, X, ArrowUpRight, Package, LogOut, LogIn } from "lucide-react";

function Navbar() {
    const url = window.location.hostname === "localhost"
        ? "http://localhost:5174/order"
        : "https://green-cart-admin.vercel.app/AdminLogin";
    const context = useContext(ShopContext);
    const token = context?.token || localStorage.getItem("token");
    const { getCartCount, role, setRole, user, profileImage, logoutUser } = context || {};
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const currentRole = role || user?.role || localStorage.getItem("role") || "user";
    const isAdmin = currentRole === "admin" || localStorage.getItem("isAdmin") === "true";
    const avatarUrl = profileImage || user?.image || "/images/profile.png";

    const handleLogout = () => {
        if (logoutUser) {
            logoutUser();
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("user");
            localStorage.removeItem("userImage");
            if (setRole) setRole("user");
        }
        navigate("/login");
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && search.trim()) {
            navigate(`/allproduct?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <img
                        src="/images/logo.svg"
                        alt="GreenCart"
                        className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Desktop Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search fresh vegetables, fruits, dairy..."
                            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-full pl-11 pr-12 py-2.5 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        {search ? (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <kbd className="hidden lg:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-300/60">
                                ↵
                            </kbd>
                        )}
                    </div>
                </div>

                {/* Desktop Navigation Links & Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center gap-1">
                        <Link
                            to="/"
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                isActive("/")
                                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                                    : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/allproduct"
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                isActive("/allproduct")
                                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                                    : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                            }`}
                        >
                            All Products
                        </Link>
                    </nav>

                    {isAdmin && (
                        <Link
                            to={url}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200/80 transition-all border border-emerald-300/60"
                        >
                            <span>Seller Hub</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    )}

                    {/* Cart Button */}
                    <Link
                        to="/cart"
                        className="relative flex items-center justify-center p-2.5 rounded-full text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 group"
                        title="Shopping Cart"
                    >
                        <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        {getCartCount && getCartCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-sm shadow-emerald-600/30 animate-in fade-in zoom-in duration-200">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>

                    {/* User Profile Dropdown */}
                    <div className="relative group">
                        <button
                            onClick={() => navigate(token ? "/profile" : "/login")}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                            aria-label="User Account"
                            title={token ? (user?.username || "My Profile") : "Sign In"}
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-sm">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    <img
                                        src={avatarUrl}
                                        alt={user?.username || "Profile"}
                                        onError={(e) => { e.target.src = "/images/profile.png"; }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </button>

                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 absolute right-0 top-full pt-2 w-56 z-50">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 divide-y divide-slate-100">
                                <div className="px-3 py-2">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        {token ? (isAdmin ? "Administrator" : "GreenCart Member") : "Welcome"}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {token ? (user?.username || "My Account") : "Guest Visitor"}
                                    </p>
                                    {token && user?.email && (
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                                    )}
                                </div>

                                <div className="py-1">
                                    {token && (
                                        <button
                                            onClick={() => navigate("/profile")}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition text-left font-medium"
                                        >
                                            <User className="w-4 h-4 text-emerald-600" />
                                            <span>My Profile</span>
                                        </button>
                                    )}
                                    {isAdmin && (
                                        <button
                                            onClick={() => window.open(url, "_blank")}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 rounded-xl transition text-left font-medium"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                            Seller Dashboard
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate("/orders")}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition text-left"
                                    >
                                        <Package className="w-4 h-4 text-slate-400" />
                                        My Orders
                                    </button>
                                </div>

                                <div className="pt-1">
                                    {token ? (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition text-left font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-xl transition text-left font-medium"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Sign In / Register
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu & Cart Icon */}
                <div className="flex md:hidden items-center gap-3">
                    <Link
                        to="/cart"
                        className="relative p-2 text-slate-700 hover:text-emerald-600"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && search.trim()) {
                                    setMenuOpen(false);
                                    navigate(`/allproduct?search=${encodeURIComponent(search.trim())}`);
                                }
                            }}
                            placeholder="Search groceries..."
                            className="w-full bg-slate-100 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 outline-none"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className={`px-3 py-2 rounded-xl text-base font-medium ${
                                isActive("/") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/allproduct"
                            onClick={() => setMenuOpen(false)}
                            className={`px-3 py-2 rounded-xl text-base font-medium ${
                                isActive("/allproduct") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700"
                            }`}
                        >
                            All Products
                        </Link>
                        {token && (
                            <Link
                                to="/profile"
                                onClick={() => setMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-base font-medium flex items-center gap-2.5 ${
                                    isActive("/profile") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <User className="w-4 h-4 text-emerald-600" />
                                <span>My Profile</span>
                            </Link>
                        )}
                        <Link
                            to="/orders"
                            onClick={() => setMenuOpen(false)}
                            className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                        >
                            <Package className="w-4 h-4 text-slate-400" />
                            <span>My Orders</span>
                        </Link>
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    window.open(url, "_blank");
                                }}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-base font-semibold text-emerald-700 bg-emerald-50"
                            >
                                <span>Seller Dashboard</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        {token ? (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/login");
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In / Register
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
