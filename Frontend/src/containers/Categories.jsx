import React, { useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { type } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { ShoppingBag, Star, Sparkles, ArrowLeft, PackageX } from "lucide-react";

function Categories() {
    const { getProductByCategory, categories, addToCart, token } = useContext(ShopContext);
    const { category } = useParams();
    const navigate = useNavigate();

    const categoryInfo = type.find(
        (item) => item.path.toUpperCase() === category?.toUpperCase()
    );

    const categoryTitle = categoryInfo?.text || category;

    const handleAddToCart = async (e, itemId) => {
        e.preventDefault();
        e.stopPropagation();
        const currentToken = token || localStorage.getItem("token");
        if (!currentToken) {
            toastr.warning("Please sign in to add products to your cart", "Login Required");
            navigate("/login");
            return;
        }
        await addToCart(itemId);
    };

    useEffect(() => {
        if (category) {
            getProductByCategory(category);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [category]);

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
                
                {/* Header Section */}
                <div className="mb-8">
                    <Link
                        to="/allproduct"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition mb-3"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to All Products</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Aisle Collection</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                {categoryTitle}
                            </h1>
                            <p className="text-slate-500 text-sm sm:text-base mt-1">
                                Freshly stocked {categoryTitle.toLowerCase()} selected for premium taste and nutritional value.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {categories.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <PackageX className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No items in this aisle</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Items in this category are currently being restocked from the farm.
                        </p>
                        <Link
                            to="/allproduct"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
                        >
                            Explore Other Aisles
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {categories.map((item) => {
                            const discount = item.price && item.offerPrice && item.price > item.offerPrice
                                ? Math.round(((item.price - item.offerPrice) / item.price) * 100)
                                : null;

                            return (
                                <div
                                    key={item._id}
                                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5"
                                >
                                    <Link to={`/product/${item._id}`} className="block">
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
                                                    {item.category || categoryTitle}
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
                                            onClick={(e) => handleAddToCart(e, item._id)}
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

export default Categories;
