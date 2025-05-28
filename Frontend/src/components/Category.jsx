import React from "react";
import { type } from "../assets/assets"
import { Link } from "react-router-dom";

function Category() {
    return (
        <>
            <div className="mt-16">
                <p className="text-2xl md:text-3xl font-medium">
                    Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
                    {type.map((asset, index) => {
                        return (
                            <Link to={`/categories/${asset.path}`} key={index}>
                                <div className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center" style={{ backgroundColor: asset.bgColor }}>
                                    <img src={asset.image} className="group-hover:scale-108 transition max-w-28" alt={asset.text} />
                                    <p className="text-sm font-medium">{asset.text}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>



            </div>
        </>
    )
}

export default Category;
