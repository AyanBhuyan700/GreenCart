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
    if (!itemId) {
      toastr.error("Invalid item");
      return;
    }

    const updatedCart = { ...cartItem, [itemId]: (cartItem[itemId] || 0) + 1 };
    setCartItem(updatedCart);

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      } catch (err) {
        console.error(err.message);
      }
    }
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
    addToCart,
    updateCart,
    removeCartItem,
    getUserCart,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
