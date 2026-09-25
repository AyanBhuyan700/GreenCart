import React from "react";
import { NavLink } from 'react-router-dom';
import { PlusCircle, PackageCheck, ClipboardList, Store } from 'lucide-react';

const navItems = [
    {
        icon: PlusCircle,
        text: "Add Product",
        link: "/add"
    },
    {
        icon: PackageCheck,
        text: "Product List",
        link: "/product"
    },
    {
        icon: ClipboardList,
        text: "Customer Orders",
        link: "/order"
    }
];

function Sidebar() {
    return (
        <aside className="md:w-64 w-20 border-r border-slate-200 min-h-[calc(100vh-65px)] bg-slate-50/60 p-3 flex flex-col justify-between">
            <div className="space-y-1">
                <div className="hidden md:block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Store Operations
                </div>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            to={item.link}
                            key={index}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                                    isActive
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                        : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-700"}`} />
                                    <span className="hidden md:inline-block">{item.text}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>

            <div className="p-2 border-t border-slate-200 hidden md:block">
                <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-200"
                >
                    <Store className="w-4 h-4" />
                    <span>View Customer Store ↗</span>
                </a>
            </div>
        </aside>
    );
}

export default Sidebar;
