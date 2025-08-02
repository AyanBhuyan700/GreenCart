import React, { useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { type } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

function Categories() {
    const { getProductByCategory, categories } = useContext(ShopContext);
    const { category } = useParams();


    useEffect(() => {
        if (category) {
            getProductByCategory(category);
        }
    }, [category]);

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="mt-16">
                <div className="flex flex-col items-end w-max">
                    <p className="text-2xl font-medium uppercase">
                        {
                            type.find((item) => item.path.toUpperCase() === category.toUpperCase())?.text.toUpperCase()
                            || category.toUpperCase()
                        }
                    </p>
                    <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
                    {categories.map((item) => (
                        <Link to={`/product/${item._id}`} key={item._id} className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2">
                            <div className="group cursor-pointer flex items-center justify-center py-2">
                                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={item.image?.[0]} loading="lazy" />
                            </div>
                            <div className="text-gray-500/60 text-sm">
                                <p>{item.category}</p>
                                <p className="text-gray-700 font-medium text-lg truncate w-full">{item.name}</p>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 4.5].map((value, index) => (
                                        <img
                                            key={index}
                                            className="md:w-4 w-3.5"
                                            src={value === 4.5 ? "/images/halfstar.svg" : "/images/star.svg"}
                                            alt="star"
                                            loading="lazy"
                                        />
                                    ))}
                                    <p>(4)</p>
                                </div>
                                <div className="flex items-end justify-between mt-2">
                                    <p className="md:text-xl text-base font-medium text-[#4fbf8b]">
                                        ${item.offerPrice}
                                        <span className="text-gray-500/60 md:text-sm text-xs line-through">${item.price}</span>
                                    </p>
                                    <button className="flex items-center cursor-pointer justify-center gap-1 bg-[#4fbf8b]/10 border border-[#4fbf8b]/40 px-2 md:w-20 w-16 h-8.5 rounded text-[#4fbf8b]">
                                        <img className="w-3.5" alt="cart_icon" src="/images/greencart.svg" loading="lazy" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Categories;
