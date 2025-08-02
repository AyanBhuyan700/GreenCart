import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function ViewProduct() {
  const { id, category } = useParams();
  const { viewProduct, getProductByCategory, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);

  function handleOrder() {
    toastr.info("Currently not available");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await viewProduct(id);
      setProduct(data);
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (category) {
      getProductByCategory(category);
    }
  }, [category]);

  return (
    <>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mt-12">
          {product ? (
            <>
              <div>
                <Link to="/">Home / </Link>
                <Link to="/allproduct">Products / </Link>
                <Link to={`/categories/${product.category}`}>
                  {product.category} /{" "}
                </Link>
                <span className="text-[#4fbf8b]">{product.name}</span>
              </div>

              <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                  </div>
                  <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                  <h1 className="text-3xl font-medium">{product.name}</h1>

                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 4.5].map((value, index) => (
                      <img
                        key={index}
                        className="md:w-4 w-3.5"
                        src={
                          value === 4.5
                            ? "/images/halfstar.svg"
                            : "/images/star.svg"
                        }
                        alt="star"
                      />
                    ))}
                    <p>(4)</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-500/70 line-through">MRP: ${product.price}</p>
                    <p className="text-2xl font-medium">MRP: ${product.offerPrice}</p>
                    <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    {!product.inStock && (
                      <p className="mt-2 text-red-600 font-semibold">Out of Stock</p>
                    )}
                  </div>

                  <p className="text-base font-medium mt-6">About Product</p>
                  <ul className="list-disc ml-4 text-gray-500/70">
                    {product.description
                      .split("\n")
                      .map((desc) => desc.trim())
                      .filter((desc) => desc.length > 0)
                      .slice(0, 3)
                      .map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                  </ul>

                  <div className="flex items-center mt-10 gap-4 text-base">
                    <button
                      className={`w-full py-3.5 font-medium transition ${product.inStock
                        ? "cursor-pointer bg-gray-100 text-gray-800/80 hover:bg-gray-200"
                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                      disabled={!product.inStock}
                      onClick={() => addToCart(product._id)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className={`w-full py-3.5 font-medium transition ${product.inStock
                        ? "cursor-pointer bg-[#4fbf8b] text-white hover:bg-[#44ae7c]"
                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                      disabled={!product.inStock}
                      onClick={handleOrder}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center mt-12 text-gray-500">Loading product...</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewProduct;
