import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Gift, NotebookIcon as Lotus, Info, Calendar, Clock, MapPin, Sparkles, PartyPopper, Heart } from "lucide-react";
import { UserOrderDetails } from "./UserOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useUserCartData from "../../hooks/useUserCartData";
import { fetchUserData } from "../../redux/userSlice";
import { applyCoupon } from "../../services/coupon-service/coupon";
import { useState } from "react";
import { getCoupon } from "../../services/coupon-service/coupon";
import {API} from "../../utils/api";


// Add this in your main CSS file or at the top of your component
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
  
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  
  .font-playfair {
    font-family: 'Playfair Display', serif;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #f0f;
    opacity: 0.7;
  }
`;

export default function CheckoutPage() {


  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [applyOnNextChange, setApplyOnNextChange] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData?.data);

  useEffect(() => {

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');
    if (isLoggedIn && userId) {
      dispatch(fetchUserData(userId));
    }
  }, [dispatch]);
  


  const { cartItems, isLoading } = useUserCartData();
  const currencySymbol = "₹";
  console.log(cartItems)
 


  // Calculate totals with proper decimal handling
const subtotal = parseFloat(cartItems.reduce(
  (sum, item) => sum + (item.price * item.quantity), 
  0
).toFixed(2));

 const handleApplyCoupon = async () => {
  if (!couponCode.trim()) {
    setCouponMessage("Please enter a coupon code");
    return;
  }

  setIsApplyingCoupon(true);

  try {
    const result = await applyCoupon(couponCode.trim()); // Trim the coupon code before sending
   

    if (result.valid) {
      // Handle percentage or fixed discount
      let calculatedDiscount = 0;
      if (result.discountType === "percentage") {
        calculatedDiscount = (subtotal * result.discountValue) / 100;
        // Round to 2 decimal places for currency
        calculatedDiscount = parseFloat(calculatedDiscount.toFixed(2));
      } else if (result.discountType === "fixed") {
        calculatedDiscount = Math.min(result.discountValue, subtotal); // Ensure discount doesn't exceed total
      }

      // Ensure total doesn't go negative
      const newTotal = subtotal - calculatedDiscount;
      if (newTotal < 0) {
        calculatedDiscount = subtotal;
      }

      setDiscountAmount(calculatedDiscount);
      setCouponApplied(true);
      setCouponMessage(result.message || "Coupon applied successfully!");
    } else {
      setCouponApplied(false);
      setDiscountAmount(0);
      setCouponMessage(result.message || "Invalid coupon code");
    }
  } catch (error) {
    console.error("Coupon application error:", error);
    setCouponApplied(false);
    setDiscountAmount(0);
    setCouponMessage(error.message || "Failed to apply coupon. Please try again.");
  } finally {
    setIsApplyingCoupon(false);
  }
};
useEffect(() => {
  if (applyOnNextChange && couponCode.trim()) {
    handleApplyCoupon();
    setApplyOnNextChange(false); // reset
  }
}, [couponCode]);

const handleRemoveCoupon = () => {
  setCouponCode("");
  setCouponApplied(false);
  setDiscountAmount(0);
  setCouponMessage("");
};


const total = Math.max(0, (subtotal - discountAmount)) // Ensure total doesn't go negative



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
  console.log(coupons)
  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-amber-50 font-poppins relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-amber-200 opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-20 w-24 h-24 rounded-full bg-purple-200 opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-amber-200 opacity-20 animate-float animation-delay-3000"></div>

        {/* Special Offers Banner */}
        <div className="w-full bg-gradient-to-r from-amber-400 to-amber-400 border-b-2 border-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-white" />
              <p className="text-sm text-white">
                <span className="font-semibold">Special Celebration Offers! 🎊</span> Exclusive discounts for your special occasion!
              </p>
            </div>
            <Link to="#" className="text-white hover:underline text-sm font-medium flex items-center">
              See All Deals & Offers <Sparkles className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Lotus className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 font-playfair">
                Celebration Checkout
              </h1>
            </div>
            <Link to="/cart" className="self-start sm:self-auto">
              <button className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-lg flex items-center shadow-sm transition-all hover:shadow-md">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Cart
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary (Top on mobile, right on desktop) */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-4 space-y-6">
                <div className="border-2 border-amber-200 shadow-lg rounded-xl overflow-hidden bg-white">
                  <div className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4">
                    <h2 className="text-center text-amber-800 font-medium text-lg">Order Summary 💝</h2>
                  </div>
                  <div className="p-0">
                    {cartItems.map((item) => (
                      <div key={item._id} className="p-4 border-b border-amber-100 hover:bg-amber-50 transition-colors">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden border-2 border-amber-200 shadow-sm">
                            <img
                              // src={"https://a4celebration.com/api/" + item.featured_image}
                              src={`${API_BASE_URL}${item.featured_image}`}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                              <Heart className="h-3 w-3 text-amber-500 fill-amber-500" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-medium text-amber-800">{item.name}</h3>
                            <div className="bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded-full text-xs inline-flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                              {item.stock_left > 0 ? "Ready to Celebrate!" : "Ready to Celebrate!"}
                            </div>
                            {(item.service_date || item.service_time) && (
                              <>
                                {item.service_date && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="h-3 w-3 text-amber-500" />
                                    <span>Date: {new Date(item.service_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {item.service_time && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Clock className="h-3 w-3 text-amber-500" />
                                    <span>Time: {item.service_time}</span>
                                  </div>
                                )}
                              </>
                            )}

                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs">Qty: {item.quantity}</span>
                              <span className="font-medium text-amber-700">
                                {currencySymbol}
                                {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal ({cartItems.length} items):</span>
                        <span className="font-medium">
                          {currencySymbol}
                          {subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          {currencySymbol}
                          {(0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">
                          {currencySymbol}
                          {(0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className={`font-medium ${discountAmount > 0 ? 'text-green-600' : ''}`}>
                          {discountAmount > 0 ? `-${currencySymbol}${discountAmount.toFixed(2)}` : '-'}
                        </span>
                      </div>

                      <div className="my-2 bg-gradient-to-r from-transparent via-amber-200 to-transparent h-px"></div>

                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-amber-800">Total:</span>
                        <span className="text-amber-800">
                          {currencySymbol}
                          {total.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
  {coupons
    .filter(c => new Date(c.expiryDate) >= new Date())
    .map(c => {
      const usedUp = c.usedCount >= c.usageLimit;
      const active = c.isActive && !usedUp;
      const discount = c.discountType === 'percentage' 
        ? `${c.discountValue}% OFF` 
        : `₹${c.discountValue} OFF`;
      
      // Color schemes for different coupon types and statuses
      const colors = !active ? {
        bg: 'from-rose-50 to-rose-100 border-rose-200',
        text: 'text-rose-700',
        badge: 'bg-rose-200 text-rose-800',
        code: 'text-rose-800'
      } : c.discountType === 'fixed' ? {
        bg: 'from-blue-50 to-blue-100 border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-200 text-blue-800',
        code: 'text-blue-800'
      } : c.discountValue >= 20 ? {
        bg: 'from-purple-50 to-purple-100 border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-200 text-purple-800',
        code: 'text-purple-800'
      } : {
        bg: 'from-amber-50 to-amber-100 border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-200 text-amber-800',
        code: 'text-amber-800'
      };

      return (
        <div key={c._id} className={`relative p-3 rounded-lg bg-gradient-to-r ${colors.bg} border border-dashed ${!active && 'opacity-70'}`}  onClick={() => {
    if (active) {
      setCouponCode(c.code);        // update state
      setApplyOnNextChange(true);   // tell useEffect to auto-apply
    }
  }}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`font-mono font-bold text-sm ${colors.code}`}>{c.code}</p>
              <p className={`text-xs ${colors.text}`}>{discount}</p>
              <p className="text-xs text-gray-500 mt-1">Valid until {new Date(c.expiryDate).toLocaleDateString()}</p>
            </div>
            <p className={`text-lg font-bold mt-2 ${!active && 'line-through'} ${colors.text}`}>
              {discount.split(' ')[0]}
            </p>
          </div>
          {!active && <div className={`absolute top-1 right-1 ${colors.badge} text-xs px-2 py-0.5 rounded`}>
            {usedUp ? 'Used Up' : 'Inactive'}
          </div>}
          {active && c.discountValue >= 20 && <div className={`absolute top-1 right-1 ${colors.badge} text-xs px-2 py-0.5 rounded`}>
            Hot Deal
          </div>}
        </div>
      );
    })}
</div>

                      <div className="pt-3">
                        <div className="flex items-center space-x-2">
                          <input
                            placeholder="🎁 Enter Promo code..."
                            className="border-2 border-amber-200 rounded-lg px-3 py-2 focus:border-amber-400 w-full focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={couponApplied}
                          />
                          <button
                            onClick={couponApplied ? handleRemoveCoupon : handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className={`border-2 border-amber-300 ${couponApplied
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                              } px-4 py-2 rounded-lg flex items-center shadow-sm hover:shadow-md transition-all`}
                          >
                            {isApplyingCoupon ? 'Applying...' : couponApplied ? 'Applied!' : 'Apply'}
                          </button>
                        </div>
                        {couponMessage && (
                          <p className={`mt-2 text-sm ${couponApplied ? 'text-green-600' : 'text-red-600'}`}>
                            {couponMessage}
                          </p>
                        )}
                        {couponApplied && (
                          <button
                            onClick={handleRemoveCoupon}
                            className="mt-2 text-xs text-amber-700 hover:text-amber-900 underline"
                          >
                            Remove coupon
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-amber-50 border-2 border-amber-200 rounded-xl p-4 text-sm shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <PartyPopper className="h-5 w-5 text-amber-600" />
                    <h3 className="font-medium text-amber-800">Celebration Information</h3>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Our team will contact you within 24 hours to finalize your celebration details and confirm the decoration timings.
                  </p>
                  <p className="text-gray-700">
                    For urgent queries: <span className="text-amber-700 font-medium">support@a4cleberation.com</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Form (Bottom on mobile, left on desktop) */}
            <div className="lg:col-span-2 order-2 lg:order-1">
             <UserOrderDetails 
  cartItems={cartItems} 
  currencySymbol={currencySymbol} 
  userData={userData} 
  discountAmount={discountAmount}
  total={total}
/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}