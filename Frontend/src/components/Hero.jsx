import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Clock, ShoppingBag } from "lucide-react";

function Hero() {
    return (
        <section className="relative mt-6 lg:mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
                
                {/* Content Left Column */}
                <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                    
                    {/* Organic Trust Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide">
                        <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                        <span>100% Certified Farm-Fresh & Organic</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                        Freshness You Can <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300 bg-clip-text text-transparent">Trust</span>, Savings You'll <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent">Love</span>
                    </h1>

                    {/* Description */}
                    <p className="text-emerald-100/80 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                        Handpicked crisp vegetables, seasonal fruits, organic dairy, and pantry favorites delivered straight from local farmers to your kitchen doorstep in 30 minutes.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                        <Link
                            to="/allproduct"
                            className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <ShoppingBag className="w-5 h-5 text-slate-950" />
                            <span>Shop Fresh Produce</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/deals"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200"
                        >
                            <span>Explore Deals</span>
                            <Zap className="w-4 h-4 text-amber-300" />
                        </Link>
                    </div>

                    {/* Mini Quick Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-800/60 w-full">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-200 font-medium">
                            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>15-30 Min Delivery</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-200 font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Quality Guaranteed</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2.5 text-xs sm:text-sm text-emerald-200 font-medium">
                            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Daily Fresh Deals</span>
                        </div>
                    </div>
                </div>

                {/* Visual Right Column */}
                <div className="lg:col-span-5 relative flex justify-center items-center">
                    <div className="relative w-full max-w-md lg:max-w-none">
                        {/* Decorative Backdrop Card */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-emerald-900/40 backdrop-blur-sm group">
                            <img
                                src="/images/main_banner.png"
                                alt="Fresh groceries basket"
                                className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Floating Rating Card */}
                            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                    ★ 4.9
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">Loved by 25,000+ homes</p>
                                    <p className="text-[11px] text-emerald-300">Freshness rated supreme</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
