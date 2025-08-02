import React, { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import Loader from "../components/Loader";

function Add() {
  const url = "https://greencart-backend-lf22.onrender.com";
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([null, null, null, null]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: ""
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    }
  };

  async function createProduct() {
    setLoading(true);
    try {
      let formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      await axios.post(`${url}/api/product/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toastr.success("Product added successfully!");
      resetForm();
    } catch (err) {
      toastr.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }


  function resetForm() {
    setForm({
      name: "",
      description: "",
      category: "",
      price: "",
      offerPrice: "",
    });
    setImages([null, null, null, null]);
  }

  function onProductSubmit(e) {
    e.preventDefault();
    createProduct();
  }

  if (loading) return <Loader />;

  return (
    <>
      <form className="md:p-10 p-4 space-y-5 max-w-lg" onSubmit={onProductSubmit}>
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {images.map((image, i) => (
              <label key={i}>
                <input hidden type="file" onChange={(e) => handleImageChange(e, i)} />
                {image ? (
                  <img className="max-w-24 cursor-pointer" alt="upload" width="100" height="100" src={URL.createObjectURL(image)} />
                ) : (
                  <img className="max-w-24 cursor-pointer" alt="upload" width="100" height="100" src="./images/upload.png" />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required type="text" value={form.name} name="name" onChange={changeHandler} />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea rows="4" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here" required value={form.description} name="description" onChange={changeHandler} />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" name="category" onChange={changeHandler} value={form.category} >
            <option value="">Select Category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Drinks">Drinks</option>
            <option value="Instant">Instant</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Grains">Grains</option>
          </select>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" min="0" required type="number" value={form.price} name="price" onChange={changeHandler} />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" min="0" required type="number" value={form.offerPrice} name="offerPrice" onChange={changeHandler} />
          </div>
        </div>

        <button className="px-8 py-2.5 bg-[#4fbf8b] text-white font-medium rounded mb-4">
          ADD
        </button>
      </form>
    </>
  );
}

export default Add;
