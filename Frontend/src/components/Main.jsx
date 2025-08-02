import React, { useEffect, useState } from "react";
import { features } from '../assets/assets'
import axios from 'axios'
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Link } from "react-router-dom";
import Loader from '../components/Loader'

function Main() {
    const url = "https://greencart-backend-lf22.onrender.com";
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false)

    async function allProduct() {
        try {
            setLoading(true)
            const response = await axios.get(`${url}/api/product/get`)
            const allProducts = response.data.product || [];
            setProduct(allProducts);
            setLoading(false)
        } catch (err) {
            toastr.error("Failed to fetch products", "Error");
            setLoading(false)
        }
    }

    useEffect(() => {
        allProduct()
    }, [])

    if (loading) return <Loader />

    return (
        <>
            <div className="mt-16">
                <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">

                    {product.slice(0, 5).map((item) => {
                        return (
                            <>
                                <Link to={"/product/" + item._id} className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2">

                                    <div className="group cursor-pointer flex items-center justify-center py-2">
                                        <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={item.image?.[0]} />
                                    </div>
                                    <div className="text-gray-500/60 text-sm">
                                        <p>{item.category}</p>
                                        <p className="text-gray-700 font-medium text-lg truncate w-full">
                                            {item.name}
                                        </p>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 4.5].map((value, index) => (
                                                <img
                                                    key={index}
                                                    className="md:w-4 w-3.5"
                                                    src={value === 4.5 ? "/images/halfstar.svg" : "/images/star.svg"}
                                                    alt="star"
                                                />
                                            ))}
                                            <p>(4)</p>
                                        </div>
                                        <div className="flex items-end justify-between mt-2">
                                            <p className="md:text-xl text-base font-medium text-[#4fbf8b]">${item.offerPrice}<span className="text-gray-500/60 md:text-sm text-xs line-through"> ${item.price}</span></p>
                                            <div className="text-[#4fbf8b]">
                                                <button className="flex items-center cursor-pointer justify-center gap-1 bg-[#4fbf8b]/10 border border-[#4fbf8b]/40 px-2 md:w-20 w-16 h-8.5 rounded">
                                                    <img className="w-3.5" alt="cart_icon" src="/images/greencart.svg" />Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                            </>
                        )
                    })}

                </div>
            </div>

            <div className="relative mt-24">
                <img className="w-full hidden md:block" src="/images/bottom_banner.png" alt="Bottom banner large" />
                <img className="w-full md:hidden" src="/images/bottom_banner_image.png" alt="Bottom banner small" />
                <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-6 lg:pr-24 px-4 md:px-0">
                    <div className="max-w-md md:max-w-lg">
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#4fbf8b] mb-6 text-center md:text-right">
                            Why We Are the Best?
                        </h1>

                        {features.map((feature, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 mt-2"
                                >
                                    <img className="md:w-11 w-9" src={feature.image} alt={feature.head} />
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold">{feature.head}</h3>
                                        <p className="text-gray-500/70 text-xs md:text-sm">{feature.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14 px-4 sm:px-6 md:px-0">
                <h1 className="md:text-4xl text-2xl font-medium">Never Miss a Deal!</h1>
                <p className="md:text-lg text-gray-500/80 pb-8 max-w-xl">
                    Subscribe to get the latest offers, new arrivals, and exclusive discounts
                </p>
                <div className="flex items-center max-w-2xl w-full gap-0 border border-gray-500/30 rounded-md overflow-hidden">
                    <input
                        className="outline-none px-3 py-2 w-full text-gray-500"
                        placeholder="Enter your email id"
                        type="email"
                        aria-label="Email address"
                    />
                    <button className="bg-[#4fbf8b] text-white px-8 md:px-12 py-2 md:h-13 h-12">
                        Subscribe
                    </button>
                </div>
            </div>
        </>
    );
}

export default Main;
