import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, ShoppingBag, Gift, Info, Calendar, Clock, Copy } from "lucide-react";

import { useDispatch } from "react-redux";
import useUserCartData from "../../hooks/useUserCartData";
import { useCart } from '../../hooks/cartHook';
import axios from "axios";
import { getCoupon } from "../../services/coupon-service/coupon";
import { useRef } from "react";
import { API } from "../../utils/api";


const Cart = () => {
  const { cartItems: initialCartItems, isLoading } = useUserCartData();

  const [cartItems, setCartItems] = useState([]);
  const { cart, clearCart, removeItem } = useCart();


  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const currencySymbol = "₹";

  // Initialize cart items when they load
  useEffect(() => {
    if (initialCartItems) {
      setCartItems(initialCartItems);
    }
  }, [initialCartItems]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleRemoveItem = async (itemId) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    if (isLoggedIn && userId) {
      try {
        await removeItem(userId, itemId);
        // Update local state instead of reloading
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== itemId));
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error("Failed to remove item");
        console.error("Error removing item:", error);
      }
    }
  };



  const handleClearCart = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    if (isLoggedIn && userId) {
      try {
        await clearCart(userId);
        // Update local state instead of reloading
        setCartItems([]);
        toast.success("Cart cleared successfully");
      } catch (error) {
        toast.error("Failed to clear cart");
        console.error("Error clearing cart:", error);
      }
    }
  };


 const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupon();
        setCoupons(response);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  const sliderRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (coupons.length <= 1) return; // no auto scroll if only 1
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({
          left: 260, // card width + margin
          behavior: "smooth",
        });

        // Reset scroll if at end
        if (
          sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
          sliderRef.current.scrollWidth
        ) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000); // change every 3s

    return () => clearInterval(interval);
  }, [coupons]);

  return (
    <div className="min-h-screen bg-white font-poppins">
      <ToastContainer />

      {/* Special Offers Banner */}
      <div className="w-full bg-amber-100 border-t-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-600" />
            <p className="text-sm">
              <span className="font-semibold">Special Offers.</span> We found offers available based on items in your cart.
            </p>
          </div>
          <Link to="#" className="text-amber-700 hover:underline text-sm font-medium">
            See All Deals & Offers
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-12 text-amber-300" />
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-800">Your Cart</h1>
          </div>
          <Link to="/" className="self-start sm:self-auto">
            <button className="border border-amber-300 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded">
              Continue Shopping
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <div className="border-dashed border-2 border-amber-200 rounded-lg p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-amber-300 mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Your cart is empty</p>
                  <p className="text -sm text-gray-500 mb-6">Add items to begin your spiritual journey</p>
                  <Link to="/">
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded">
                      Browse Products
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (

                <div key={item._id} className="overflow-hidden border-amber-200 shadow-md rounded-lg">
                  <div className="relative">
                    <div className="absolute top-2 right-2">
                      <button
                        className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full"
                        onClick={() => handleRemoveItem(item.product_id)}
                      >
                    
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                       <div className="relative w-[70vw] h-[50vw] md:w-32 md:h-32 mx-auto md:mx-0 rounded-lg overflow-hidden border-2 border-amber-200 bg-white">
  <img
    // src={"https://a4celebration.com/api/" + item.featured_image}
    src={`${API}${item.featured_image}`}
    alt={item.product_name}
    className="object-cover w-full h-full"
  />
</div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <Link to="#" className="text-amber-800 hover:text-amber-600 font-medium text-lg">
                              {item.product_name}
                            </Link>
                            <span className="ml-2 bg-green-50 text-green-700 border-green-200 px-2 py-1 rounded text-sm">
                              In Stock
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.service_date && item.service_time && (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-amber-600" />
      <p className="text-sm text-gray-700">
        <span className="font-medium">Booking Date:</span>{" "}
      {`${String(new Date(item.service_date).getDate()).padStart(2, '0')}-${String(new Date(item.service_date).getMonth() + 1).padStart(2, '0')}-${new Date(item.service_date).getFullYear()}`}

      </p>
    </div>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-amber-600" />
      <p className="text-sm text-gray-700">
        <span className="font-medium">Booking Time:</span> {item.service_time}
      </p>
    </div>
  </div>
)}


                            <div className="space-y-2">
                              {item.product_id.startsWith("PROD-GIFT") && (
  <div className="flex items-center gap-2">
    <div className="flex flex-col space-y-1">
      <p className="text-xs text-green-600">
        Get it by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </p>
      <p className="text-xs text-gray-600">
        When you order by 8:00 Today
      </p>
    </div>
  </div>
)}


                              <div className="flex flex-col space-y-1 mt-2">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Quantity:</span> {item.quantity}
                                </p>
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Price:</span> {currencySymbol}{" "}
                                  {item.price.toFixed(2)}
                                </p>
                                <p className="text-sm font-medium text-amber-800">
                                  <span className="font-medium">Total:</span> {currencySymbol}{" "}
                                  {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="border-amber-200 shadow-md rounded-lg overflow-hidden">
                <div className="bg-amber-50 border-b border-amber-100 p-4">
                  <h2 className="text-center text-amber-800 font-bold">Order Summary</h2>
                </div>
                <div className="p-6 space-y-6">
               <div
      ref={sliderRef}
      className="flex overflow-x-auto space-x-3 scrollbar-hide scroll-smooth py-2"
    >
      {coupons
        .filter((coupon) => new Date(coupon.expiryDate) >= new Date())
        .map((coupon) => {
          const isUsedUp = coupon.usedCount >= coupon.usageLimit;
          const isActive = coupon.isActive && !isUsedUp;

          // 🎨 Color scheme
          let colorScheme = {
            bgFrom: "from-amber-50",
            bgTo: "to-amber-100",
            border: "border-amber-200",
            textCode: "text-amber-700",
            textDesc: "text-amber-600",
            textDate: "text-amber-500",
            textValue: "text-amber-700",
            badgeBg: "bg-amber-200",
            badgeText: "text-amber-800",
          };

          if (!isActive) {
            colorScheme = {
              bgFrom: "from-rose-50",
              bgTo: "to-rose-100",
              border: "border-rose-200",
              textCode: "text-rose-700",
              textDesc: "text-rose-600",
              textDate: "text-rose-500",
              textValue: "text-rose-700",
              badgeBg: "bg-rose-200",
              badgeText: "text-rose-800",
            };
          } else if (coupon.discountType === "fixed") {
            colorScheme = {
              bgFrom: "from-blue-50",
              bgTo: "to-blue-100",
              border: "border-blue-200",
              textCode: "text-blue-700",
              textDesc: "text-blue-600",
              textDate: "text-blue-500",
              textValue: "text-blue-700",
              badgeBg: "bg-blue-200",
              badgeText: "text-blue-800",
            };
          }

          const discountValue =
            coupon.discountType === "percentage"
              ? `${coupon.discountValue}% OFF`
              : `₹${coupon.discountValue} OFF`;

          const expiryDate = `Valid until ${new Date(
            coupon.expiryDate
          ).toLocaleDateString()}`;

           const handleCopyCode = () => {
  navigator.clipboard.writeText(coupon.code)
    .then(() => {
      // Success toast
      toast.success("Coupon code copied!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
       
      });
    })
    .catch(err => {
      // Error toast
      toast.error("Failed to copy code!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        
      });
      console.error('Failed to copy coupon code: ', err);
    });
};

          return (
            <div
              key={coupon._id}
              className={`min-w-[250px] relative p-3 rounded-lg bg-gradient-to-r ${colorScheme.bgFrom} ${colorScheme.bgTo} border ${colorScheme.border} ${
                !isActive ? "opacity-70" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-xs ${colorScheme.textDesc}`}>
                    {coupon.discountType === "percentage"
                      ? `Get ${coupon.discountValue}% discount`
                      : `Get ₹${coupon.discountValue} discount`}
                  </p>
                  <p className={`text-[10px] ${colorScheme.textDate}`}>
                    {expiryDate}
                  </p>
                  {isUsedUp && (
                    <p className="text-[10px] text-rose-500">
                      Usage limit reached
                    </p>
                  )}
                </div>
                <div
                  className={`font-bold text-sm ${
                    !isActive ? "line-through" : ""
                  } ${colorScheme.textValue}`}
                >
                  {discountValue}
                </div>
              </div>

              {isActive && (
                <span
                  onClick={handleCopyCode}
                  className={`inline-flex items-center gap-1 font-bold text-xs mt-2 ${colorScheme.textCode} cursor-pointer hover:underline`}
                  title="Click to copy"
                >
                  {coupon.code}
                  <Copy className="w-3 h-3 text-gray-500" />
                </span>
              )}

              {/* Badges */}
              {!isActive && (
                <div
                  className={`absolute top-0 right-0 ${colorScheme.badgeBg} ${colorScheme.badgeText} text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-lg`}
                >
                  {isUsedUp ? "Used Up" : "Inactive"}
                </div>
              )}
              {isActive && coupon.discountValue >= 20 && (
                <div
                  className={`absolute top-0 right-0 ${colorScheme.badgeBg} ${colorScheme.badgeText} text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-lg`}
                >
                  Hot Deal
                </div>
              )}
            </div>
          );
        })}
    </div>

                  <hr className="bg-amber-100" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-gray-600">
                        Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items):
                      </p>
                      <p className="font-medium">
                        {currencySymbol}
                        {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Shipping:</p>
                      <p className="text-green-600">Free Shipping</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Saving/Promo Code:</p>
                      <p>-</p>
                    </div>
                    <div className="flex justify-between">
                      <Link to="#" className="text-amber-700 hover:underline flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span>Estimate Tax</span>
                      </Link>
                      <p className="text-xs italic">See in Checkout</p>
                    </div>
                  </div>

                  <hr className="bg-amber-100" />

                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-amber-800">Total:</p>
                    <p className="text-lg font-bold text-amber-800">
                      {currencySymbol}
                      {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                    </p>
                  </div>

                  <button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded"
                    onClick={handleCheckout}
                    type="submit"
                    disabled={cartItems.length === 0 || isLoading}
                  >
                    {isLoading ? "Processing..." : "Proceed to Checkout"}
                  </button>

                  <button
                    className="w-full border border-amber-200 text-amber-700 hover:bg-amber-100 px-6 py-2 rounded"
                    onClick={handleClearCart}
                    disabled={cartItems.length === 0}
                  >
                    Empty Cart
                  </button>
                </div>
              </div>

              <div className="border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <img src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-1024.png" alt="Visa" width={40} height={30} />
                  <img src="https://cdn3.iconfinder.com/data/icons/payment-method-1/64/_Mastercard-1024.png" alt="Mastercard" width={40} height={30} />
                  <img src="https://cdn3.iconfinder.com/data/icons/payment-method-1/64/_Paypal-01-1024.png" alt="PayPal" width={40} height={30} />
                  <img src="https://cdn4.iconfinder.com/data/icons/circle-payment/32/payment_001-rupay-128.png" alt="RuPay" width={40} height={30} />
                  <img src="https://economictimes.indiatimes.com/thumb/msid-74960608,width-1200,height-900,resizemode-4,imgsize-49172/upi-twitter.jpg?from=mdr" alt="UPI" width={40} height={30} />
                </div>
                <p className="text-center text-xs text-gray-500 mt-3">Guarantee Safe and Secure Payment Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;