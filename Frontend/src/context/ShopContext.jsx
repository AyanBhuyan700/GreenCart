import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const url = "https://greencart-backend-lf22.onrender.com";

  const [productData, setProductData] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || "user");

  const [cartItem, setCartItem] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItem));
  }, [cartItem]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token]);

  const viewProduct = async (id) => {
    if (productData[id]) return productData[id];
    try {
      const res = await axios.get(`${url}/api/product/${id}`);
      const product = res.data.product;
      setProductData((prev) => ({ ...prev, [id]: product }));
      return product;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/product/get`);
      setProducts(res.data.product || []);
    } catch (err) {
      toastr.error("Failed to fetch products", "Error");
    } finally {
      setLoading(false);
    }
  };

  const getProductByCategory = async (category) => {
    try {
      const res = await axios.get(`${url}/api/product/category/${category}`);
      setCategories(Array.isArray(res.data.product) ? res.data.product : []);
    } catch (err) {
      toastr.error("Failed to fetch category products", "Error");
      setCategories([]);
    }
  };

  const getCartCount = () => {
    return Object.values(cartItem).reduce((total, qty) => total + qty, 0);
  };

  const addToCart = async (itemId) => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      toastr.warning("Please login to add products to your cart", "Login Required");
      return false;
    }

    if (!itemId) {
      toastr.error("Invalid item");
      return false;
    }

    const updatedCart = { ...cartItem, [itemId]: (cartItem[itemId] || 0) + 1 };
    setCartItem(updatedCart);
    toastr.success("Item added to cart");

    try {
      await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token: currentToken } });
    } catch (err) {
      console.error(err.message);
    }
    return true;
  };

  const updateCart = async (itemId, quantity) => {
    const updatedCart = { ...cartItem };

    if (quantity <= 0) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = quantity;
    }

    setCartItem(updatedCart);

    if (token) {
      try {
        await axios.put(`${url}/api/cart/update`, { itemId, quantity }, { headers: { token } });
      } catch (err) {
        toastr.error(err.response?.data?.message);
      }
    }
  };

  const getUserCart = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${url}/api/cart/get`, { headers: { token } });
      if (response.data.success) {
        setCartItem(response.data.cartData);
      }
    } catch (err) {
      console.error("Failed to fetch user cart:", err);
    }
  };

  const removeCartItem = async (itemId) => {
    if (!cartItem[itemId]) return;

    const updatedCart = { ...cartItem };
    delete updatedCart[itemId];
    setCartItem(updatedCart);

    if (token) {
      try {
        await axios.delete(`${url}/api/cart/remove`, {
          data: { itemId },
          headers: { token },
        });
        toastr.success("Item removed from cart");
      } catch (err) {
        toastr.error(err.response?.data?.message);
      }
    }
  };

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const saved = localStorage.getItem("deliveryAddress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      fullName: "Alex Morgan",
      phone: "+1 (555) 382-9104",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      zipCode: "97477",
      country: "United States"
    };
  });

  const clearCart = async () => {
    setCartItem({});
    localStorage.removeItem("cart");
  };

  const updateDeliveryAddress = (address) => {
    setDeliveryAddress(address);
    localStorage.setItem("deliveryAddress", JSON.stringify(address));
  };

  const placeOrder = async (orderData) => {
    const newOrder = {
      _id: "ORD" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === "Online" ? "Paid" : "Pending"),
      status: "Order Placed",
      transactionId: orderData.transactionId || (orderData.paymentMethod === "Online" ? "TXN" + Date.now() : null),
    };

    if (token) {
      try {
        await axios.post(
          `${url}/api/order/place`,
          { ...orderData, orderId: newOrder._id },
          { headers: { token } }
        );
      } catch (err) {
        console.warn("Backend order sync note:", err.message);
      }
    }

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    await clearCart();
    return newOrder;
  };

  const getUserOrders = async () => {
    if (token) {
      try {
        const res = await axios.get(`${url}/api/order/userorders`, { headers: { token } });
        if (res.data.success && res.data.orders?.length > 0) {
          setOrders(res.data.orders);
          localStorage.setItem("orders", JSON.stringify(res.data.orders));
          return res.data.orders;
        }
      } catch (err) {
        // Fallback to local
      }
    }
    return orders;
  };

  const value = {
    viewProduct,
    getProducts,
    products,
    loading,
    getProductByCategory,
    categories,
    setCategories,
    getCartCount,
    cartItem,
    setCartItem,
    token,
    setToken,
    role,
    setRole,
    addToCart,
    updateCart,
    removeCartItem,
    clearCart,
    getUserCart,
    orders,
    setOrders,
    placeOrder,
    getUserOrders,
    deliveryAddress,
    updateDeliveryAddress,
    url,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
