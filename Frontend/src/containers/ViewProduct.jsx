import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { 
    ShoppingBag, 
    Zap, 
    Star, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    CheckCircle2, 
    ChevronRight, 
    XCircle,
    Sparkles
} from "lucide-react";

function ViewProduct() {
  const navigate = useNavigate();
  const { id, category } = useParams();
  const { viewProduct, getProductByCategory, addToCart, instantOrder, token } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBuyNow = async () => {
    if (!product || !product.inStock) return;
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      toastr.warning("Please login to purchase products", "Login Required");
      navigate("/login");
      return;
    }
    try {
      const placed = await instantOrder(product, 1);
      if (placed) {
        navigate("/orders");
      }
    } catch (e) {
      // toastr handled inside instantOrder / placeOrder
    }
  };

  const handleAddToCart = async () => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      toastr.warning("Please login to add products to your cart", "Login Required");
      navigate("/login");
      return;
    }
    await addToCart(product._id);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await viewProduct(id);
      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (category) {
      getProductByCategory(category);
    }
  }, [category]);

  const discount = product?.price && product?.offerPrice && product.price > product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : null;

  const savings = product?.price && product?.offerPrice && product.price > product.offerPrice
    ? (product.price - product.offerPrice).toFixed(2)
    : null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Harvesting product details...</p>
          </div>
        ) : product ? (
          <div>
            {/* Breadcrumb Trail */}
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mb-8 overflow-x-auto no-scrollbar py-1">
              <Link to="/" className="hover:text-emerald-700 transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link to="/allproduct" className="hover:text-emerald-700 transition">Products</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link to={`/categories/${product.category}`} className="hover:text-emerald-700 transition">
                {product.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-emerald-700 font-semibold truncate max-w-xs">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Product Gallery Showcase */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-md flex items-center justify-center min-h-[380px] sm:min-h-[440px] overflow-hidden group">
                  {discount && (
                    <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                      SAVE {discount}%
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[320px] max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Thumbnail strip */}
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-emerald-600 p-2 flex items-center justify-center cursor-pointer shadow-xs">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details & Actions */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-md space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{product.category || "Farm Fresh"}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Review summary */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">4.9</span>
                    <span className="text-xs text-slate-400">• (120+ verified farm-fresh reviews)</span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
                      ${product.offerPrice}
                    </span>
                    {product.price > product.offerPrice && (
                      <span className="text-lg text-slate-400 line-through">
                        ${product.price}
                      </span>
                    )}
                    {savings && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        You save ${savings}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Standard packaging • Inclusive of all taxes</p>

                  <div className="pt-2">
                    {product.inStock ? (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>In Stock • Ready for 15-30 Min Delivery</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-100/60 px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Currently Sold Out</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Bullets */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Product Highlights
                  </h3>
                  <div className="space-y-2">
                    {product.description
                      ? product.description
                          .split("\n")
                          .map((desc) => desc.trim())
                          .filter((desc) => desc.length > 0)
                          .map((desc, index) => (
                            <div key={index} className="flex items-start gap-2.5 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{desc}</span>
                            </div>
                          ))
                      : (
                        <p className="text-sm text-slate-600">
                          Handpicked organic produce delivered directly from verified local farms.
                        </p>
                      )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    className={`w-full sm:w-1/2 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer shadow-xs ${
                      product.inStock
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>

                  <button
                    disabled={!product.inStock}
                    onClick={handleBuyNow}
                    className={`w-full sm:w-1/2 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                      product.inStock
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:shadow-lg cursor-pointer"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now Instantly</span>
                  </button>
                </div>

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                  <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Organic</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <RotateCcw className="w-4 h-4 text-emerald-600" />
                    <span>Instant Returns</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
            <Link to="/allproduct" className="mt-4 inline-block text-emerald-600 font-semibold hover:underline">
              Return to Catalog
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ViewProduct;
