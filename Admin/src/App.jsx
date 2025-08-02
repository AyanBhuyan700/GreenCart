import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import LoginAdmin from "./containers/LoginAdmin";
import Navbar from "./components/Navbar";
import Sidebar from "./containers/Sidebar";
import Add from "./containers/Add";
import Product from "./containers/Product";
import Order from "./containers/Order";

function Layout() {
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/adminLogin" element={<LoginAdmin />} />

      <Route path="/" element={<Layout />}>
        <Route path="add" element={<Add />} />
        <Route path="product" element={<Product />} />
        <Route path="order" element={<Order />} />
      </Route>
    </Routes>
  );
}

export default App;
