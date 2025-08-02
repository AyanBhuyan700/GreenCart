import React, { useEffect, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

function Product() {
  const url = "https://greencart-backend-lf22.onrender.com";
  const [product, setProduct] = useState([]);

  async function getProduct() {
    try {
      const response = await axios.get(`${url}/api/product/get`);
      setProduct(response.data.product);
    } catch (err) {
      toastr.error("Failed to fetch products", "Error");
    }
  }

  const handleInStockToggle = async (id, currentStatus) => {
    try {
      await axios.put(`${url}/api/product/update/${id}`, {
        inStock: !currentStatus,
      });

      setProduct((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, inStock: !currentStatus } : item
        )
      );

      toastr.success("Stock status updated", "Success");
    } catch (error) {
      toastr.error("Failed to update stock status", "Error");
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {product.map((item) => {
                return (
                  <tr className="border-t border-gray-500/20" key={item._id}>
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded p-2">
                        <img alt="product" className="w-16" src={item.image?.[0]} />
                      </div>
                      <span className="truncate max-sm:hidden w-full">{item.name}</span>
                    </td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">{item.price}</td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          className="sr-only peer"
                          type="checkbox"
                          checked={item.inStock}
                          onChange={() => handleInStockToggle(item._id, item.inStock)}
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Product;
