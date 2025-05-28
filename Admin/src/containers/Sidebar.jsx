import React from "react";
import { features } from '../assets/assets'
import { NavLink } from 'react-router-dom'

function Sidebar() {
    return (
        <>
            <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 py-2 flex flex-col">
                {features.map((feature, index) => {
                    return (
                        <NavLink to={feature.link} key={index} className="flex items-center py-3 px-4 gap-3 border-r-4 md:border-r-[6px] border-transparent hover:bg-gray-100/90">
                            <img src={feature.image} />
                            <p className="md:block hidden text-center">{feature.text}</p>
                        </NavLink>
                    )
                })}
            </div>
        </>
    )
}

export default Sidebar;
