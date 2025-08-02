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
    } = useContext(ShopContext);

    const [cartData, setCartData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    function handleOrder() {
        toastr.info("Currently not available");
    }


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
                        subtotal: cartItem[id] * product.price,
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
                            <p className="text-gray-500 text-center col-span-full">Your cart is empty.</p>
                        ) : (
                            cartData.map((item) => (
                                <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] items-center py-3 ">
                                    <div className="flex items-center md:gap-6 gap-3">
                                        <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                            <img className="max-w-full h-full object-cover" alt={item.name} src={item.image} />
                                        </div>
                                        <div>
                                            <p className="hidden md:block font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">Weight: N/A</p>
                                            <div className="flex items-center text-sm mt-1">
                                                <span className="mr-2 text-gray-500">Qty:</span>
                                                <select
                                                    className="outline-none border border-gray-300 px-2 py-1 rounded"
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

                                    <p className="text-center">${item.offerPrice.toFixed(2)}</p>

                                    <button
                                        onClick={() => removeCartItem(item.id)}
                                        className="flex justify-center"
                                    >
                                        <img className="w-6 h-6" alt="Remove item" src="./images/cross.svg" />
                                    </button>
                                </div>
                            ))
                        )}

                        <button
                            className="group cursor-pointer flex items-center mt-8 gap-2 text-[#4fbf8b] font-medium"
                            onClick={() => navigate("/allProduct")}
                        >
                            <img className="group-hover:-translate-x-1 transition" alt="arrow" src="./images/greenarrow.svg" />
                            Continue Shopping
                        </button>
                    </div>


                    <div className="max-w-90 w-full bg-gray-100 p-5 max-md:mt-16">
                        <h2 className="text-xl md:text-2xl font-medium">Order Summary</h2>
                        <hr className="border-gray-300 my-5" />

                        <div className="mb-6">
                            <p className="text-base font-medium uppercase">Delivery Address</p>
                            <div className="relative flex justify-between items-start mt-2">
                                <p className="text-gray-500">No address found</p>
                                <button className="text-[#4fbf8b] hover:underline cursor-pointer">Change</button>
                            </div>

                            <p className="text-base font-medium uppercase mt-6">Payment Method</p>
                            <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                                <option value="COD">Cash On Delivery</option>
                                <option value="Online">Online Payment</option>
                            </select>
                        </div>

                        <hr className="border-gray-300" />

                        <div className="text-gray-500 mt-4 space-y-2">
                            <p className="flex justify-between"><span>Price</span><span>${totalPrice.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Shipping Fee</span><span className="text-green-600">Free</span></p>
                            <p className="flex justify-between"><span>Tax (2%)</span><span>${(totalPrice * 0.02).toFixed(2)}</span></p>
                            <p className="flex justify-between text-lg font-medium mt-3">
                                <span>Total Amount:</span>
                                <span>${(totalPrice * 1.02).toFixed(2)}</span>
                            </p>
                        </div>

                        <button className="w-full py-3 mt-6 cursor-pointer bg-[#4fbf8b] text-white font-medium hover:bg-[#44ae7c] transition"
                            onClick={handleOrder}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Cart;
