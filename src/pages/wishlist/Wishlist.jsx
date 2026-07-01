import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../../redux/wishListSlice";
import { getFullProductDetails } from "../../utils/getFullProductDetails";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Lightbulb,
  Gift,
  Cake,
  PartyPopper,
  EyeIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API } from "../../utils/api";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { items: wishlistItems, status } = useSelector((state) => state.wishlist);
  console.log(wishlistItems)
  const [enrichedItems, setEnrichedItems] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const enrichWishlist = async () => {
      const enriched = await Promise.all(
        wishlistItems.map(async (item) => {
          // Get full product details
          if (item.ProductDetails) {
            return { ...item, product: item.ProductDetails };
          }
          const productDetails = await getFullProductDetails(item.productId);
          const ProductDetails = productDetails.data;
          return { ...item, product: ProductDetails };
        })
      );
      setEnrichedItems(enriched);
    };

    if (wishlistItems.length > 0) {
      enrichWishlist();
    } else {
      setEnrichedItems([]);
    }
  }, [wishlistItems]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist({ userId, productId }));
  };

  // Helper for icon based on product name
  const getProductIcon = (name, className = "w-4 h-4 text-amber-500 mr-2") => {
    if (!name) return <Cake className={className} />;
    if (name.toLowerCase().includes("lamp")) return <PartyPopper className={className} />;
    if (name.toLowerCase().includes("bulb")) return <Lightbulb className={className} />;
    if (name.toLowerCase().includes("vase")) return <Gift className={className} />;
    return <Cake className={className} />;
  };


  const getProductPath = (product) => {
  if (product.category_name?.toLowerCase() === "decorations") {
    return `/decorations/service/${product.slug_url}`;
  } 
   else {
    return `/gifts/e-commerce/${product.slug_url}`;
  }
};


  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="flex items-center justify-center mb-2">
        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mr-2 sm:mr-3 fill-amber-200" />
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800">
          Your Favorite Items
        </h1>
      </div>

      <p className="text-center text-sm sm:text-base text-gray-500 mb-6 sm:mb-10">
        There are {String(enrichedItems.length).padStart(2, "0")} products in
        this list
      </p>

      {status === "loading" ? (
        <div className="text-center py-10 text-gray-500">
          Loading wishlist...
        </div>
      ) : enrichedItems.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-amber-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Add items you love to your wishlist. Review them anytime and easily
            move them to the cart.
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="w-full hidden sm:table">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-2 font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">
                  Unit Price
                </th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">
                  Stock Status
                </th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {enrichedItems.map(({ _id, product }) =>
                product ? (
                  <tr key={_id} className="border-b hover:bg-amber-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden bg-gray-100 mr-4">
                          <img
                            src={
                              product.featured_image
                                ? // ? `https://a4celebration.com/api/${product.featured_image.replace(/^\/?/, "")}`
                                  `${API}${product.featured_image.replace(/^\/?/, "")}`
                                : "/placeholder.svg"
                            }
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex items-center">
                          {getProductIcon(product.name)}
                          <span className="font-medium text-gray-800 text-sm sm:text-base">
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      {product.isOffer &&
                      product.price !== product.originalPrice ? (
                        <>
                          <span className="text-gray-400 line-through mr-2 text-sm sm:text-base">
                            ₹{product.originalPrice}
                          </span>
                          <span className="font-semibold text-gray-800 text-sm sm:text-base">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          ₹{product.price}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                          product.stock_left > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock_left > 0 ? "In Stock" : "Stock Out"}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex space-x-2">
                        <Link
                          to={getProductPath(product)}
                          state={{ serviceData: product }}
                        >
                          <button className="border border-gray-200 hover:bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded flex items-center text-sm">
                            <EyeIcon className="w-4 h-4 text-amber-500" />
                          </button>
                        </Link>
                        <button
                          className="border border-gray-200 hover:bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded flex items-center text-sm"
                          onClick={() =>
                            handleRemove(product.product_id || product._id)
                          }
                        >
                          <Trash2 className="w-4 h-4 text-amber-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {enrichedItems.map(({ _id, product }) =>
              product ? (
                <div
                  key={_id}
                  className="border-b border-amber-100 p-3 hover:bg-amber-50 rounded-lg"
                >
                  <div className="flex">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-3">
                      <img
                        src={
                          product.featured_image
                            ? // ? `https://a4celebration.com/api/${product.featured_image.replace(/^\/?/, "")}`
                              `${API}api/${product.featured_image.replace(/^\/?/, "")}`
                            : "/placeholder.svg"
                        }
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {getProductIcon(
                          product.name,
                          "w-3 h-3 text-amber-500 mr-1",
                        )}
                        <span className="font-medium text-gray-800 text-sm">
                          {product.name}
                        </span>
                      </div>
                      <div className="mb-1">
                        {product.isOffer &&
                        product.price !== product.originalPrice ? (
                          <>
                            <span className="text-gray-400 line-through mr-2 text-xs">
                              ₹{product.originalPrice}
                            </span>
                            <span className="font-semibold text-gray-800 text-sm">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-800 text-sm">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          product.stock_left > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock_left > 0 ? "In Stock" : "Stock Out"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Link
                      to={getProductPath(product)}
                      state={{ serviceData: product }}
                    >
                      <button className="border border-gray-200 hover:bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded flex items-center text-sm">
                        <EyeIcon className="w-4 h-4 text-amber-500" />
                      </button>
                    </Link>

                    <button
                      className="border border-gray-200 hover:bg-gray-100 text-gray-500 font-semibold py-1 px-2 rounded flex items-center text-xs"
                      onClick={() =>
                        handleRemove(product.product_id || product._id)
                      }
                    >
                      <Trash2 className="w-3 h-3 text-amber-500" />
                    </button>
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-10 flex justify-between items-center">
        <div className="flex items-center text-amber-500">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-200 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm font-medium">
            Save your favorites for later
          </span>
        </div>
      </div>
    </div>
  );
}