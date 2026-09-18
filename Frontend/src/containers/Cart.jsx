import React, { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function Cart() {
    const navigate = useNavigate();
    const {
        cartItem,
        getCartCount,
        viewProduct,
        updateCart,
        removeCartItem,
        deliveryAddress,
        updateDeliveryAddress,
        placeOrder,
        token,
    } = useContext(ShopContext);

    const [cartData, setCartData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Address Modal State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: deliveryAddress?.fullName || "",
        phone: deliveryAddress?.phone || "",
        street: deliveryAddress?.street || "",
        city: deliveryAddress?.city || "",
        state: deliveryAddress?.state || "",
        zipCode: deliveryAddress?.zipCode || "",
        country: deliveryAddress?.country || "United States",
    });

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
    });
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        if (deliveryAddress) {
            setAddressForm({
                fullName: deliveryAddress.fullName || "",
                phone: deliveryAddress.phone || "",
                street: deliveryAddress.street || "",
                city: deliveryAddress.city || "",
                state: deliveryAddress.state || "",
                zipCode: deliveryAddress.zipCode || "",
                country: deliveryAddress.country || "United States",
            });
        }
    }, [deliveryAddress]);

    async function handleOrder() {
        const currentToken = token || localStorage.getItem("token");
        if (!currentToken) {
            toastr.warning("Please login to proceed with placing your order.", "Login Required");
            navigate("/login");
            return;
        }

        if (cartData.length === 0) {
            toastr.warning("Your cart is empty.");
            return;
        }

        if (!deliveryAddress || !deliveryAddress.street) {
            toastr.warning("Please provide your delivery address.");
            setShowAddressModal(true);
            return;
        }

        if (paymentMethod === "COD") {
            try {
                setIsSubmitting(true);
                const orderTotal = Number((totalPrice * 1.02).toFixed(2));
                await placeOrder({
                    items: cartData,
                    amount: orderTotal,
                    address: deliveryAddress,
                    paymentMethod: "COD",
                    paymentStatus: "Pending",
                });
                toastr.success("Order placed successfully with Cash on Delivery!");
                navigate("/orders");
            } catch (err) {
                toastr.error("Failed to place order. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Online Payment Modal
            setShowPaymentModal(true);
        }
    }

    const handleSaveAddress = (e) => {
        e.preventDefault();
        if (!addressForm.fullName || !addressForm.street || !addressForm.city || !addressForm.phone) {
            toastr.warning("Please fill in all required fields.");
            return;
        }
        updateDeliveryAddress(addressForm);
        toastr.success("Delivery address updated!");
        setShowAddressModal(false);
    };

    const handleFillTestCard = () => {
        setCardDetails({
            cardNumber: "4242 •••• •••• 4242",
            cardHolder: addressForm.fullName || "Alex Morgan",
            expiry: "12/28",
            cvv: "888",
        });
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
            toastr.warning("Please enter complete card details.");
            return;
        }

        try {
            setPaymentProcessing(true);
            // Simulate secure payment gateway transaction
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const orderTotal = Number((totalPrice * 1.02).toFixed(2));
            await placeOrder({
                items: cartData,
                amount: orderTotal,
                address: deliveryAddress,
                paymentMethod: "Online",
                paymentStatus: "Paid",
                transactionId: "TXN_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
            });

            setShowPaymentModal(false);
            toastr.success("Payment successful! Order placed.");
            navigate("/orders");
        } catch (err) {
            toastr.error("Payment failed. Please try again.");
        } finally {
            setPaymentProcessing(false);
        }
    };

    useEffect(() => {
        async function loadCartData() {
            const items = await Promise.all(
                Object.keys(cartItem).map(async (id) => {
                    const product = await viewProduct(id);
                    if (!product) return null;
                    return {
                        id,
                        ...product,
                        quantity: cartItem[id],
                        subtotal: cartItem[id] * product.offerPrice,
                    };
                })
            );
            setCartData(items.filter(Boolean));
        }

        loadCartData();
    }, [cartItem]);

    useEffect(() => {
        const total = cartData.reduce((acc, item) => acc + item.subtotal, 0);
        setTotalPrice(total);
    }, [cartData]);

    return (
        <>
            <div className="px-6 md:px-16 lg:px-24 xl:px-32">
                <div className="flex flex-col md:flex-row mt-16">
                    <div className="flex-1 max-w-4xl">
                        <h1 className="text-3xl font-medium mb-6">
                            Shopping Cart
                            <span className="text-sm text-[#4fbf8b]"> {getCartCount()} Items</span>
                        </h1>

                        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                            <p className="text-left">Product Details</p>
                            <p className="text-center">Subtotal</p>
                            <p className="text-center">Action</p>
                        </div>

                        {cartData.length === 0 ? (
                            <p className="text-gray-500 text-center col-span-full py-8">Your cart is empty.</p>
                        ) : (
                            cartData.map((item) => (
                                <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center md:gap-6 gap-3">
                                        <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                            <img className="max-w-full h-full object-cover" alt={item.name} src={item.image} />
                                        </div>
                                        <div>
                                            <p className="hidden md:block font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">Weight: N/A</p>
                                            <div className="flex items-center text-sm mt-1">
                                                <span className="mr-2 text-gray-500">Qty:</span>
                                                <select
                                                    className="outline-none border border-gray-300 px-2 py-1 rounded cursor-pointer"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateCart(item.id, parseInt(e.target.value))
                                                    }
                                                >
                                                    {[...Array(10).keys()].map((num) => (
                                                        <option key={num + 1} value={num + 1}>
                                                            {num + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-center font-medium">${item.offerPrice.toFixed(2)}</p>

                                    <button
                                        onClick={() => removeCartItem(item.id)}
                                        className="flex justify-center hover:opacity-75 transition cursor-pointer"
                                        title="Remove item"
                                    >
                                        <img className="w-6 h-6" alt="Remove item" src="/images/cross.svg" onError={(e) => { e.target.style.display = 'none'; }} />
                                    </button>
                                </div>
                            ))
                        )}

                        <button
                            className="group cursor-pointer flex items-center mt-8 gap-2 text-[#4fbf8b] font-medium"
                            onClick={() => navigate("/allProduct")}
                        >
                            <img className="group-hover:-translate-x-1 transition" alt="arrow" src="/images/greenarrow.svg" onError={(e) => { e.target.style.display = 'none'; }} />
                            <span>←</span> Continue Shopping
                        </button>
                    </div>

                    <div className="max-w-90 w-full bg-gray-100 p-5 max-md:mt-16 rounded-md shadow-sm h-fit">
                        <h2 className="text-xl md:text-2xl font-medium">Order Summary</h2>
                        <hr className="border-gray-300 my-5" />

                        <div className="mb-6">
                            <p className="text-base font-medium uppercase">Delivery Address</p>
                            <div className="relative flex justify-between items-start mt-2">
                                {deliveryAddress && deliveryAddress.street ? (
                                    <div className="text-gray-600 text-xs space-y-0.5 pr-2">
                                        <p className="font-semibold text-gray-800 text-sm">{deliveryAddress.fullName}</p>
                                        <p>{deliveryAddress.street}</p>
                                        <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}</p>
                                        <p className="text-gray-500">Phone: {deliveryAddress.phone}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No address found</p>
                                )}
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="text-[#4fbf8b] hover:underline cursor-pointer text-sm font-medium shrink-0"
                                >
                                    Change
                                </button>
                            </div>

                            <p className="text-base font-medium uppercase mt-6">Payment Method</p>
                            <select
                                className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none text-sm rounded cursor-pointer"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="COD">Cash On Delivery (COD)</option>
                                <option value="Online">Online Payment (Card / Gateway)</option>
                            </select>
                        </div>

                        <hr className="border-gray-300" />

                        <div className="text-gray-500 mt-4 space-y-2">
                            <p className="flex justify-between"><span>Price</span><span>${totalPrice.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Shipping Fee</span><span className="text-green-600 font-medium">Free</span></p>
                            <p className="flex justify-between"><span>Tax (2%)</span><span>${(totalPrice * 0.02).toFixed(2)}</span></p>
                            <p className="flex justify-between text-lg font-medium mt-3 text-gray-800">
                                <span>Total Amount:</span>
                                <span className="text-[#4fbf8b]">${(totalPrice * 1.02).toFixed(2)}</span>
                            </p>
                        </div>

                        <button
                            className={`w-full py-3 mt-6 font-medium text-white transition rounded flex items-center justify-center gap-2 ${
                                isSubmitting || cartData.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "cursor-pointer bg-[#4fbf8b] hover:bg-[#44ae7c]"
                            }`}
                            disabled={isSubmitting || cartData.length === 0}
                            onClick={handleOrder}
                        >
                            {isSubmitting ? "Processing Order..." : paymentMethod === "Online" ? "Proceed to Payment" : "Place Order"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Address Edit Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                            <h3 className="text-lg font-medium text-gray-800">Delivery Address</h3>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSaveAddress} className="space-y-3 text-sm">
                            <div>
                                <label className="block text-gray-600 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.fullName}
                                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                    placeholder="e.g. Alex Morgan"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                    placeholder="e.g. +1 (555) 382-9104"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Street Address *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-600 mb-1">City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                        placeholder="Springfield"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">State / Region *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                        placeholder="OR"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-600 mb-1">ZIP / Postal Code *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.zipCode}
                                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                        placeholder="97477"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">Country</label>
                                    <input
                                        type="text"
                                        value={addressForm.country}
                                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                        placeholder="United States"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#4fbf8b] hover:bg-[#44ae7c] text-white rounded font-medium cursor-pointer"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Online Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#4fbf8b] font-bold">
                                    💳
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">Card Payment</h3>
                                    <p className="text-xs text-gray-500">256-bit SSL Encrypted & Secure</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !paymentProcessing && setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                                disabled={paymentProcessing}
                            >
                                ×
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-md p-3 mb-4 flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total Payable Amount:</span>
                            <span className="text-lg font-bold text-[#4fbf8b]">${(totalPrice * 1.02).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-end mb-3">
                            <button
                                type="button"
                                onClick={handleFillTestCard}
                                className="text-xs text-[#4fbf8b] hover:underline cursor-pointer font-medium flex items-center gap-1"
                            >
                                <span>⚡ Fill Demo Card Info</span>
                            </button>
                        </div>

                        <form onSubmit={handleProcessPayment} className="space-y-3 text-sm">
                            <div>
                                <label className="block text-gray-600 mb-1">Cardholder Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={cardDetails.cardHolder}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b]"
                                    placeholder="Name on card"
                                    disabled={paymentProcessing}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Card Number *</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="19"
                                    value={cardDetails.cardNumber}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b] tracking-wider font-mono"
                                    placeholder="4242 4242 4242 4242"
                                    disabled={paymentProcessing}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-600 mb-1">Expiry (MM/YY) *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="5"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b] font-mono"
                                        placeholder="MM/YY"
                                        disabled={paymentProcessing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">CVV / CVC *</label>
                                    <input
                                        type="password"
                                        required
                                        maxLength="4"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-[#4fbf8b] font-mono"
                                        placeholder="•••"
                                        disabled={paymentProcessing}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 mt-4">
                                <button
                                    type="submit"
                                    disabled={paymentProcessing}
                                    className={`w-full py-3 rounded text-white font-medium cursor-pointer transition flex items-center justify-center gap-2 ${
                                        paymentProcessing
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#4fbf8b] hover:bg-[#44ae7c]"
                                    }`}
                                >
                                    {paymentProcessing ? (
                                        <>
                                            <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                                            Authorizing Payment...
                                        </>
                                    ) : (
                                        `Pay $${(totalPrice * 1.02).toFixed(2)} Securely`
                                    )}
                                </button>
                                <button
                                    type="button"
                                    disabled={paymentProcessing}
                                    onClick={() => setShowPaymentModal(false)}
                                    className="w-full mt-2 py-2 text-xs text-gray-500 hover:text-gray-700 text-center cursor-pointer"
                                >
                                    Cancel and return to cart
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Cart;
