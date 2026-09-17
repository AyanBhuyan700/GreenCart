import React, { useEffect, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

function Order() {
    const url = "https://greencart-backend-lf22.onrender.com";
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${url}/api/order/list`, {
                headers: token ? { token } : {}
            });
            if (res.data.success && Array.isArray(res.data.orders) && res.data.orders.length > 0) {
                setOrders(res.data.orders);
                localStorage.setItem("orders", JSON.stringify(res.data.orders));
                return;
            }
        } catch (err) {
            console.warn("Backend order fetch fallback to local storage:", err.message);
        } finally {
            setLoading(false);
        }

        // Fallback to local storage (shared with frontend orders)
        const saved = localStorage.getItem("orders");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setOrders(parsed);
                    return;
                }
            } catch (e) {}
        }

        // Pre-populate sample order if completely empty for demonstration
        const sampleOrders = [
            {
                _id: "ORD" + Math.floor(100000 + Math.random() * 900000),
                date: new Date(Date.now() - 3600000 * 4).toISOString(),
                items: [
                    {
                        name: "7 Up 1.5L",
                        quantity: 2,
                        offerPrice: 70,
                        image: ["https://res.cloudinary.com/ayanbhuyan/image/upload/v1747479371/cxfffpv6zdqlpol2vbu5.png"],
                    },
                    {
                        name: "Butter Croissant 100g",
                        quantity: 3,
                        offerPrice: 25,
                        image: ["https://res.cloudinary.com/ayanbhuyan/image/upload/v1748427624/metcg5atsfuup05bqy77.png"],
                    }
                ],
                amount: 219.30,
                address: {
                    fullName: "Alex Morgan",
                    phone: "+1 (555) 382-9104",
                    street: "742 Evergreen Terrace",
                    city: "Springfield",
                    state: "OR",
                    zipCode: "97477",
                    country: "United States",
                },
                paymentMethod: "Online",
                paymentStatus: "Paid",
                status: "Order Placed",
                transactionId: "TXN_SAMPLE99",
            },
            {
                _id: "ORD" + Math.floor(100000 + Math.random() * 900000),
                date: new Date(Date.now() - 3600000 * 24).toISOString(),
                items: [
                    {
                        name: "Banana 1 kg",
                        quantity: 2,
                        offerPrice: 45,
                        image: ["https://res.cloudinary.com/ayanbhuyan/image/upload/v1747479514/uk4qeqkorbtjubfbaaoc.png"],
                    },
                    {
                        name: "Eggs 12 pcs",
                        quantity: 1,
                        offerPrice: 50,
                        image: ["https://res.cloudinary.com/ayanbhuyan/image/upload/v1748427777/abvxbbrfk0dqh7tunchi.png"],
                    }
                ],
                amount: 142.80,
                address: {
                    fullName: "Sarah Jenkins",
                    phone: "+1 (555) 609-4112",
                    street: "128 Oak Ridge Lane",
                    city: "Portland",
                    state: "OR",
                    zipCode: "97201",
                    country: "United States",
                },
                paymentMethod: "COD",
                paymentStatus: "Pending",
                status: "Packing",
            }
        ];
        setOrders(sampleOrders);
        localStorage.setItem("orders", JSON.stringify(sampleOrders));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.post(`${url}/api/order/status`, { orderId, status: newStatus });
        } catch (err) {
            console.warn("Backend status update fallback to local:", err.message);
        }

        const updated = orders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
        );
        setOrders(updated);
        localStorage.setItem("orders", JSON.stringify(updated));
        toastr.success(`Order #${orderId} updated to "${newStatus}"`, "Success");
    };

    const getNextStatusAction = (currentStatus) => {
        switch (currentStatus) {
            case "Order Placed":
                return { next: "Packing", label: "📦 Start Packing", color: "bg-amber-600 hover:bg-amber-700" };
            case "Packing":
                return { next: "Shipped", label: "🚚 Mark as Shipped", color: "bg-blue-600 hover:bg-blue-700" };
            case "Shipped":
            case "Out for delivery":
                return { next: "Delivered", label: "✅ Mark as Delivered", color: "bg-[#4fbf8b] hover:bg-[#44ae7c]" };
            default:
                return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-800 border border-emerald-300";
            case "Shipped":
            case "Out for delivery":
                return "bg-blue-100 text-blue-800 border border-blue-300";
            case "Packing":
                return "bg-amber-100 text-amber-800 border border-amber-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 border border-red-300";
            default:
                return "bg-emerald-50 text-[#4fbf8b] border border-emerald-200";
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter and search
    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            statusFilter === "All" ? true : order.status === statusFilter;
        const matchesSearch =
            !searchTerm ||
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.address?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.address?.phone?.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    // Counts
    const counts = {
        all: orders.length,
        placed: orders.filter((o) => o.status === "Order Placed").length,
        packing: orders.filter((o) => o.status === "Packing").length,
        shipped: orders.filter((o) => o.status === "Shipped" || o.status === "Out for delivery").length,
        delivered: orders.filter((o) => o.status === "Delivered").length,
        totalRevenue: orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
    };

    return (
        <div className="w-full md:p-10 p-4 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Order <span className="text-[#4fbf8b]">Management</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Track, process, and update customer order fulfillment status
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 bg-[#4fbf8b] hover:bg-[#44ae7c] text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer shadow-sm w-fit"
                >
                    <span className={loading ? "animate-spin" : ""}>↻</span>
                    Refresh Orders
                </button>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{counts.all}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-emerald-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">Order Placed</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{counts.placed}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">Packing</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{counts.packing}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">Shipped</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{counts.shipped}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-purple-500 col-span-2 md:col-span-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">Revenue</p>
                    <p className="text-2xl font-bold text-[#4fbf8b] mt-1">${counts.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {["All", "Order Placed", "Packing", "Shipped", "Delivered"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${
                                statusFilter === tab
                                    ? "bg-[#4fbf8b] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search by Order ID, customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs outline-[#4fbf8b] bg-gray-50/50"
                    />
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="font-medium text-base text-gray-700">No orders match the selected filter</p>
                    <p className="text-xs text-gray-400 mt-1">Try selecting "All" or clearing the search box</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const nextAction = getNextStatusAction(order.status || "Order Placed");
                        return (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition overflow-hidden"
                            >
                                {/* Order Top Bar */}
                                <div className="bg-gray-50/80 px-5 py-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                        <div>
                                            <span className="text-gray-400 block uppercase text-[10px] font-bold">Order ID</span>
                                            <span className="font-mono font-semibold text-gray-800 text-sm">#{order._id}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block uppercase text-[10px] font-bold">Date</span>
                                            <span className="text-gray-700">
                                                {order.date ? new Date(order.date).toLocaleString() : "Recently"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block uppercase text-[10px] font-bold">Total Amount</span>
                                            <span className="font-bold text-[#4fbf8b] text-sm">${Number(order.amount).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Action & Status controls */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status || "Order Placed")}`}>
                                            ● {order.status || "Order Placed"}
                                        </span>

                                        {/* Status Changer Dropdown */}
                                        <select
                                            value={order.status || "Order Placed"}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="border border-gray-300 rounded px-2.5 py-1 text-xs outline-[#4fbf8b] font-medium bg-white cursor-pointer"
                                        >
                                            <option value="Order Placed">Order Placed</option>
                                            <option value="Packing">Packing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Out for delivery">Out for delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>

                                        {/* Fast Progression Button */}
                                        {nextAction && (
                                            <button
                                                onClick={() => handleStatusChange(order._id, nextAction.next)}
                                                className={`px-3 py-1 text-white rounded text-xs font-medium transition cursor-pointer shadow-sm ${nextAction.color}`}
                                            >
                                                {nextAction.label}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
                                    {/* Items List */}
                                    <div className="lg:col-span-2">
                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Items in Order ({order.items ? order.items.length : 0})</p>
                                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-md p-3 bg-white">
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} className="py-2 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded border border-gray-200 flex items-center justify-center p-1 bg-white shrink-0 overflow-hidden">
                                                            <img
                                                                src={Array.isArray(item.image) ? item.image[0] : item.image}
                                                                alt={item.name}
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 text-xs">{item.name}</p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Qty: <span className="font-semibold text-gray-700">{item.quantity}</span> × ${Number(item.offerPrice).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-gray-700 text-xs">
                                                        ${(item.quantity * item.offerPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Timeline Bar */}
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between max-w-md text-[11px] text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-5 h-5 rounded-full bg-[#4fbf8b] text-white flex items-center justify-center font-bold text-[10px] mb-1">
                                                        ✓
                                                    </div>
                                                    <span className="font-medium text-[#4fbf8b]">Placed</span>
                                                </div>
                                                <div className={`flex-1 h-0.5 mx-2 ${
                                                    order.status !== "Order Placed" ? "bg-[#4fbf8b]" : "bg-gray-200"
                                                }`}></div>
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                                                        order.status === "Packing" || order.status === "Shipped" || order.status === "Delivered" ? "bg-[#4fbf8b] text-white" : "bg-gray-200 text-gray-600"
                                                    }`}>
                                                        {order.status === "Packing" || order.status === "Shipped" || order.status === "Delivered" ? "✓" : "2"}
                                                    </div>
                                                    <span>Packing</span>
                                                </div>
                                                <div className={`flex-1 h-0.5 mx-2 ${
                                                    order.status === "Shipped" || order.status === "Delivered" ? "bg-[#4fbf8b]" : "bg-gray-200"
                                                }`}></div>
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                                                        order.status === "Shipped" || order.status === "Delivered" ? "bg-[#4fbf8b] text-white" : "bg-gray-200 text-gray-600"
                                                    }`}>
                                                        {order.status === "Shipped" || order.status === "Delivered" ? "✓" : "3"}
                                                    </div>
                                                    <span>Shipped</span>
                                                </div>
                                                <div className={`flex-1 h-0.5 mx-2 ${
                                                    order.status === "Delivered" ? "bg-[#4fbf8b]" : "bg-gray-200"
                                                }`}></div>
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                                                        order.status === "Delivered" ? "bg-[#4fbf8b] text-white" : "bg-gray-200 text-gray-600"
                                                    }`}>
                                                        {order.status === "Delivered" ? "✓" : "4"}
                                                    </div>
                                                    <span className={order.status === "Delivered" ? "font-medium text-emerald-700" : ""}>Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer, Shipping & Payment Details */}
                                    <div className="bg-gray-50/70 p-4 rounded-md border border-gray-200/80 flex flex-col justify-between text-xs">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="font-bold text-gray-700 uppercase text-[10px] mb-1">Customer & Delivery</p>
                                                {order.address ? (
                                                    <>
                                                        <p className="font-semibold text-gray-900 text-sm">{order.address.fullName}</p>
                                                        <p className="text-gray-600 mt-0.5">{order.address.street}</p>
                                                        <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                                                        <p className="text-gray-500 mt-1">📞 {order.address.phone}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-400">No address recorded</p>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-gray-200">
                                                <p className="font-bold text-gray-700 uppercase text-[10px] mb-1">Payment Method</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                                        order.paymentMethod === "Online"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-gray-200 text-gray-700"
                                                    }`}>
                                                        {order.paymentMethod === "Online" ? "💳 Online Payment" : "💵 Cash On Delivery"}
                                                    </span>
                                                    <span className="text-gray-500 font-semibold">
                                                        ({order.paymentStatus || (order.paymentMethod === "Online" ? "Paid" : "Pending")})
                                                    </span>
                                                </div>
                                                {order.transactionId && (
                                                    <p className="text-gray-400 text-[10px] mt-1 font-mono">
                                                        Ref: {order.transactionId}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-200 mt-3 flex justify-between items-center">
                                            <span className="text-gray-500">Order Total:</span>
                                            <span className="text-base font-bold text-[#4fbf8b]">
                                                ${Number(order.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Order;
