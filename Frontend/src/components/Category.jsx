import React from "react";
import { type } from "../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid } from "lucide-react";

function Category() {
    return (
        <section className="mt-16 sm:mt-20">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Aisles & Departments</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Shop By Category
                    </h2>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        Handpicked daily harvests and pantry staples sorted for convenience.
                    </p>
                </div>
                
                <Link
                    to="/allproduct"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                    <span>View All Products</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5">
                {type.map((asset, index) => {
                    return (
                        <Link
                            to={`/categories/${asset.path}`}
                            key={index}
                            className="group block"
                        >
                            <div
                                className="relative rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between h-44 sm:h-48 border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center overflow-hidden"
                                style={{
                                    backgroundColor: asset.bgColor || "#f8fafc"
                                }}
                            >
                                {/* Subtle Light Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                                {/* Category Image */}
                                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                                    <img
                                        src={asset.image}
                                        alt={asset.text}
                                        className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>

                                {/* Category Title & Indicator */}
                                <div className="relative z-10 w-full mt-2">
                                    <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-800 transition-colors line-clamp-1">
                                        {asset.text}
                                    </p>
                                    <span className="text-[11px] text-slate-500 font-medium group-hover:text-emerald-700 transition-colors">
                                        Explore →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default Category;
