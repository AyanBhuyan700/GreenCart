import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Zap, ShoppingBag, Star, Sparkles, Timer, Flame } from "lucide-react";

function Deals() {
  const { getProducts, products, loading, addToCart, token } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = async (itemId) => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      toastr.warning("Please sign in to add products to your cart", "Login Required");
      navigate("/login");
      return;
    }
    await addToCart(itemId);
  };

  // Find products that have discount or are on offer
  const discountedProducts = products.filter(
    (p) => p.offerPrice && p.price && Number(p.price) > Number(p.offerPrice)
  );

  const displayDeals = discountedProducts.length > 0 ? discountedProducts : products.slice(0, 8);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Deals Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 sm:p-12 mb-10 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
              <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>FLASH SAVINGS EVENT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Exclusive Fresh Deals & Steals
            </h1>
            <p className="text-orange-100 text-sm sm:text-base max-w-lg">
              Stock your kitchen with farm-fresh produce, cold-pressed beverages, and pantry essentials at up to 40% off regular retail.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayDeals.map((item) => {
            const discount = item.price && item.offerPrice && item.price > item.offerPrice
              ? Math.round(((item.price - item.offerPrice) / item.price) * 100)
              : 15;

            return (
              <div
                key={item._id}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5"
              >
                <Link to={"/product/" + item._id} className="block">
                  <div className="relative bg-slate-50/80 rounded-xl p-3 flex items-center justify-center h-44 overflow-hidden mb-3">
                    <span className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-current" />
                      {discount}% OFF
                    </span>
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className="max-h-36 max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.category || "Hot Deal"}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold text-slate-600 ml-1">4.9</span>
                      </div>
                    </div>

                    <h3 className="text-slate-800 font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </Link>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Deal Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                        ${item.offerPrice}
                      </span>
                      {item.price && (
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
      </div>

      <Footer />
    </div>
  );
}

export default Deals;
