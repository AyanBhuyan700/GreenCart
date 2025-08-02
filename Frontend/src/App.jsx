import React from "react";
import Navbar from "./components/Navbar";
import Home from "./containers/Home";
import { Route, Routes } from "react-router-dom";
import AllProduct from "./containers/AllProduct";
import Deals from "./containers/Deals";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ViewProduct from "./containers/ViewProduct";
import Categories from "./containers/Categories";
import Cart from "./containers/Cart";

function App() {
  return (
    <>
      <div className="text-default min-h-screen text-gray-700 bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allproduct" element={<AllProduct />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/categories/:category" element={<Categories />} />
        </Routes>
      </div>

    </>
  )
}

export default App;
