import React, { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { ShopContext } from "../context/ShopContext";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { 
    ShoppingBag, 
    Star, 
    Sparkles, 
    Search, 
    SlidersHorizontal, 
    ArrowUpDown, 
    PackageX 
} from "lucide-react";

const CATEGORIES = [
    "All",
    "Vegetables",
    "Fruits",
    "Drinks",
    "Instant",
    "Dairy",
    "Bakery",
    "Grains"
];

function AllProduct() {
    const navigate = useNavigate();
    const { getProducts, products, loading, addToCart, token } = useContext(ShopContext);
    const location = useLocation();
    
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");

    const handleAddToCart = async (itemId) => {
        const currentToken = token || localStorage.getItem("token");
        if (!currentToken) {
            toastr.warning("Please sign in to add products to your cart", "Login Required");
            navigate("/login");
            return;
        }
        await addToCart(itemId);
    };

    const searchParam = new URLSearchParams(location.search).get("search")?.trim().toLowerCase() || "";

    useEffect(() => {
        getProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Filter & Sort Logic
    let filtered = products;

    if (searchParam) {
        filtered = filtered.filter((item) =>
            item.name?.toLowerCase().includes(searchParam) ||
            item.category?.toLowerCase().includes(searchParam)
        );
    }

    if (selectedCategory !== "All") {
        filtered = filtered.filter((item) =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    if (sortBy === "price-low") {
        filtered = [...filtered].sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
    } else if (sortBy === "price-high") {
        filtered = [...filtered].sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
    }

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
                
                {/* Header Banner */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fresh Direct Catalog</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                {searchParam ? `Results for "${searchParam}"` : "All Fresh Groceries"}
                            </h1>
                            <p className="text-slate-500 text-sm sm:text-base mt-1">
                                Showing {filtered.length} healthy farm-fresh {filtered.length === 1 ? "item" : "items"} ready for quick delivery.
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 self-start md:self-auto">
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2 shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                            >
                                <option value="featured">Featured Picks</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                selectedCategory === cat
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <PackageX className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            We couldn't find matches for your current filter. Try adjusting your search query or reset category filter.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory("All");
                                navigate("/allproduct");
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {filtered.map((item) => {
                            const discount = item.price && item.offerPrice && item.price > item.offerPrice
                                ? Math.round(((item.price - item.offerPrice) / item.price) * 100)
                                : null;

                            return (
                                <div
                                    key={item._id}
                                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5"
                                >
                                    <Link to={"/product/" + item._id} className="block">
                                        {/* Image Container with Badges */}
                                        <div className="relative bg-slate-50/80 rounded-xl p-3 flex items-center justify-center h-44 overflow-hidden mb-3">
                                            {discount && (
                                                <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                                                    {discount}% OFF
                                                </span>
                                            )}
                                            <img
                                                src={item.image?.[0]}
                                                alt={item.name}
                                                className="max-h-36 max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    {item.category || "Grocery"}
                                                </span>
                                                <div className="flex items-center gap-0.5 text-amber-400">
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                    <span className="text-xs font-bold text-slate-600 ml-1">4.8</span>
                                                </div>
                                            </div>

                                            <h3 className="text-slate-800 font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                                {item.name}
                                            </h3>
                                        </div>
                                    </Link>

                                    {/* Price & Add to Cart Footer */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">Price</span>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                                                    ${item.offerPrice}
                                                </span>
                                                {item.price > item.offerPrice && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        ${item.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(item._id)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs sm:text-sm border border-emerald-200/80 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                                            title="Add to basket"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default AllProduct;
