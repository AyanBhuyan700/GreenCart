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

  // Cart items are managed in state and persisted directly to the database via API, NOT stored in localStorage
  const [cartItem, setCartItem] = useState({});

  useEffect(() => {
    // Clear any obsolete legacy local storage items
    localStorage.removeItem("cart");
    localStorage.removeItem("orders");

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
    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      getUserCart();
      getUserOrders();
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

    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      try {
        await axios.put(`${url}/api/cart/update`, { itemId, quantity }, { headers: { token: activeToken } });
      } catch (err) {
        toastr.error(err.response?.data?.message);
      }
    }
  };

  const getUserCart = async () => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) return;
    try {
      const response = await axios.get(`${url}/api/cart/get`, { headers: { token: activeToken } });
      if (response.data.success && response.data.cartData) {
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

    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      try {
        await axios.delete(`${url}/api/cart/remove`, {
          data: { itemId },
          headers: { token: activeToken },
        });
        toastr.success("Item removed from cart");
      } catch (err) {
        toastr.error(err.response?.data?.message);
      }
    }
  };

  // Orders are stored directly in MongoDB database, NOT in localStorage
  const [orders, setOrders] = useState([]);

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
  };

  const updateDeliveryAddress = (address) => {
    setDeliveryAddress(address);
    localStorage.setItem("deliveryAddress", JSON.stringify(address));
  };

  // Place order directly into MongoDB database
  const placeOrder = async (orderData) => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) {
      toastr.warning("Please login to place an order.", "Login Required");
      throw new Error("Login required");
    }

    try {
      const res = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token: activeToken } }
      );

      if (res.data.success && res.data.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        await clearCart();
        return res.data.order;
      } else {
        throw new Error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      const errMsg = err.response?.data?.message || err.message || "Order placement failed";
      toastr.error(errMsg, "Error");
      throw err;
    }
  };

  // Instant order for a single product directly into database
  const instantOrder = async (product, quantity = 1) => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) {
      toastr.warning("Please login to complete your order", "Login Required");
      return null;
    }
    if (!product || !product._id) {
      toastr.error("Invalid product");
      return null;
    }

    const item = {
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      offerPrice: product.offerPrice,
      image: product.image,
      quantity,
      subtotal: Number(product.offerPrice) * quantity,
    };

    const orderTotal = Number((item.subtotal * 1.02).toFixed(2));
    const orderData = {
      items: [item],
      amount: orderTotal,
      address: deliveryAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
    };

    const placed = await placeOrder(orderData);
    toastr.success("Order placed successfully!");
    return placed;
  };

  // Fetch orders directly from MongoDB database
  const getUserOrders = async () => {
    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) return [];
    try {
      const res = await axios.get(`${url}/api/order/userorders`, { headers: { token: activeToken } });
      if (res.data.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
        return res.data.orders;
      }
    } catch (err) {
      console.error("User orders fetch error:", err);
    }
    return [];
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
    instantOrder,
    getUserOrders,
    deliveryAddress,
    updateDeliveryAddress,
    url,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
