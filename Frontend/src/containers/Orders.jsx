import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";

function Orders() {
    const navigate = useNavigate();
    const { orders, getUserOrders } = useContext(ShopContext);

    useEffect(() => {
        if (getUserOrders) {
            getUserOrders();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const formatDate = (isoString) => {
        if (!isoString) return "Recently";
        try {
            const d = new Date(isoString);
            return d.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return isoString;
        }
    };

    const getStatusPill = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-800 border border-emerald-300";
            case "Shipped":
            case "Out for delivery":
                return "bg-blue-100 text-blue-800 border border-blue-300";
            case "Packing":
            case "Processing":
                return "bg-amber-100 text-amber-800 border border-amber-300";
            default:
                return "bg-emerald-50 text-[#4fbf8b] border border-emerald-200";
        }
    };

    return (
        <>
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 min-h-[70vh] py-12">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-medium text-gray-800">
                            My <span className="text-[#4fbf8b]">Orders</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Track and manage your recent GreenCart purchases
                        </p>
                    </div>
                    <Link
                        to="/allproduct"
                        className="text-sm font-medium text-[#4fbf8b] hover:underline flex items-center gap-1"
                    >
                        <span>← Continue Shopping</span>
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center text-3xl text-[#4fbf8b]">
                            📦
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">No orders placed yet</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                            Browse our fresh products and place your first order today!
                        </p>
                        <button
                            onClick={() => navigate("/allproduct")}
                            className="mt-6 px-6 py-2.5 bg-[#4fbf8b] hover:bg-[#44ae7c] text-white font-medium rounded transition cursor-pointer"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-sm">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div>
                                            <span className="text-xs text-gray-500 block uppercase font-medium">Order ID</span>
                                            <span className="font-mono font-semibold text-gray-800">#{order._id}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block uppercase font-medium">Date Placed</span>
                                            <span className="text-gray-700">{formatDate(order.date)}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block uppercase font-medium">Total Amount</span>
                                            <span className="font-bold text-[#4fbf8b] text-base">${Number(order.amount).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            order.paymentMethod === "Online"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-gray-200 text-gray-700"
                                        }`}>
                                            {order.paymentMethod === "Online" ? "💳 Online (Paid)" : "💵 Cash On Delivery"}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusPill(order.status)}`}>
                                            ● {order.status || "Order Placed"}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="divide-y divide-gray-100">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded border border-gray-200 p-1 flex items-center justify-center overflow-hidden shrink-0 bg-white">
                                                        <img
                                                            src={Array.isArray(item.image) ? item.image[0] : item.image}
                                                            alt={item.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: <span className="font-semibold text-gray-700">{item.quantity}</span> × ${Number(item.offerPrice).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-semibold text-gray-800 text-sm">
                                                        ${(item.quantity * item.offerPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping details */}
                                    {order.address && (
                                        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-gray-600 bg-gray-50/70 p-3.5 rounded">
                                            <div>
                                                <span className="font-semibold text-gray-700 block mb-0.5">Delivery Address:</span>
                                                <p>
                                                    {order.address.fullName} • {order.address.phone}
                                                </p>
                                                <p>
                                                    {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}
                                                </p>
                                            </div>
                                            {order.transactionId && (
                                                <div className="md:text-right">
                                                    <span className="text-gray-500 block">Transaction Reference:</span>
                                                    <span className="font-mono text-gray-700">{order.transactionId}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Order tracking steps */}
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between max-w-xl text-xs text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <div className="w-6 h-6 rounded-full bg-[#4fbf8b] text-white flex items-center justify-center font-bold text-xs mb-1">
                                                    ✓
                                                </div>
                                                <span className="font-medium text-[#4fbf8b]">Order Placed</span>
                                            </div>
                                            <div className="flex-1 h-0.5 bg-[#4fbf8b] mx-2"></div>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                                                    order.status !== "Order Placed" ? "bg-[#4fbf8b] text-white" : "bg-gray-200 text-gray-600"
                                                }`}>
                                                    2
                                                </div>
                                                <span>Processing</span>
                                            </div>
                                            <div className={`flex-1 h-0.5 mx-2 ${
                                                order.status === "Shipped" || order.status === "Delivered" ? "bg-[#4fbf8b]" : "bg-gray-200"
                                            }`}></div>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                                                    order.status === "Shipped" || order.status === "Delivered" ? "bg-[#4fbf8b] text-white" : "bg-gray-200 text-gray-600"
                                                }`}>
                                                    3
                                                </div>
                                                <span>Shipped</span>
                                            </div>
                                            <div className={`flex-1 h-0.5 mx-2 ${
                                                order.status === "Delivered" ? "bg-[#4fbf8b]" : "bg-gray-200"
                                            }`}></div>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                                                    order.status === "Delivered" ? "bg-[#4fbf8b] text-white" : "bg-gray-200 text-gray-600"
                                                }`}>
                                                    4
                                                </div>
                                                <span>Delivered</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Orders;
