import React from "react";
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <>
            <div className="mt-10">
                <div className="relative">
                    <img src="/images/main_banner.png" alt="Main Banner" className="w-full hidden md:block" decoding="async" />
                    <img src="/images/mobile_banner.png" alt="Mobile Banner" className="w-full md:hidden" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
                        <h1 className="text-4xl md:text-4xl lg:text-5xl font-extrabold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15">
                            Freshness You Can Trust, Savings You will Love!
                        </h1>
                        <div className="flex items-center mt-6 font-medium">
                            <Link to={"/allproduct"} className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-[#4fbf8b] hover:bg-[#44ae7c] transition rounded text-white cursor-pointer">Shop now</Link>
                            <Link to={"/deals"} className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer">Explore deals
                                <img src="/images/arrow.svg" className="transition group-hover:translate-x-1" loading="lazy" decoding="async" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero;
