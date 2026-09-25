import React, { useEffect, useState, useContext } from "react";
import { features } from '../assets/assets';
import axios from 'axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Link, useNavigate } from "react-router-dom";
import Loader from '../components/Loader';
import { ShopContext } from "../context/ShopContext";
import { 
    ShoppingBag, 
    Star, 
    Sparkles, 
    ArrowRight, 
    Mail, 
    CheckCircle2, 
    TrendingUp, 
    ShieldCheck, 
    Clock, 
    CircleDollarSign 
} from "lucide-react";

function Main() {
    const url = "https://greencart-backend-lf22.onrender.com";
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { addToCart, token } = useContext(ShopContext);

    async function allProduct() {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/product/get`);
            const allProducts = response.data.product || [];
            setProduct(allProducts);
            setLoading(false);
        } catch (err) {
            toastr.error("Failed to fetch products", "Error");
            setLoading(false);
        }
    }

    const handleAddToCart = async (e, itemId) => {
        e.preventDefault();
        e.stopPropagation();
        const currentToken = token || localStorage.getItem("token");
        if (!currentToken) {
            toastr.warning("Please sign in to add items to your cart", "Login Required");
            navigate("/login");
            return;
        }
        await addToCart(itemId);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            toastr.error("Please enter a valid email address");
            return;
        }
        setSubscribed(true);
        toastr.success("Welcome! You're subscribed to GreenCart VIP deals.");
        setEmail("");
    };

    useEffect(() => {
        allProduct();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-28">
            
            {/* BEST SELLERS SECTION */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Top Daily Picks</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Best Sellers in Store
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 mt-1">
                            Most loved groceries harvested daily and packed with nutrients.
                        </p>
                    </div>

                    <Link
                        to="/allproduct"
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        <span>View All Best Sellers</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {product.slice(0, 10).map((item) => {
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

                                    {/* Product Details */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                {item.category || "Organic"}
                                            </span>
                                            {/* Stars */}
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
            </section>

            {/* WHY WE ARE THE BEST - BENTO CARDS SHOWCASE */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>The GreenCart Standard</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Why Over 50,000 Families Trust Us Daily
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
                        We skip middlemen and connect direct with sustainable organic farms to deliver peak flavor and unbeatable value.
                    </p>
                </div>

                {/* 3 Pillars Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Lightning 30-Min Drop</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Temperature-controlled hyper-local hubs keep your greens chilled and crisp until they reach your countertop.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">100% Quality Guaranteed</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Every single fruit and vegetable is hand-inspected. Not satisfied? Instant full refund with zero questions asked.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <CircleDollarSign className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Fair Farmgate Pricing</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Transparent honest pricing where farmers earn more and you pay less than traditional supermarket markups.
                        </p>
                    </div>
                </div>
            </section>

            {/* NEWSLETTER PROMO SECTION */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-8 sm:p-12 shadow-xl">
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                        <Mail className="w-3.5 h-3.5" />
                        <span>VIP Fresh Club</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Get $15 Off Your First Fresh Order
                    </h2>
                    
                    <p className="text-emerald-100 text-sm sm:text-base max-w-lg mx-auto">
                        Join 80,000+ happy foodies. Receive weekly seasonal harvest boxes, member secret sales, and chef-curated recipes.
                    </p>

                    <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                        <div className="relative w-full">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full bg-white text-slate-800 text-sm rounded-2xl pl-11 pr-4 py-3.5 shadow-md border-0 focus:ring-4 focus:ring-emerald-300/40 outline-none"
                                required
                            />
                            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 shrink-0"
                        >
                            Claim $15
                        </button>
                    </form>

                    {subscribed && (
                        <div className="flex items-center justify-center gap-2 text-emerald-100 text-sm font-semibold pt-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                            <span>Promo coupon sent to your inbox!</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Main;
