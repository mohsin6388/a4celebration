import { ChevronDown, ChevronUp, User, Phone, Mail, Home, Flag, MapPin, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RazorPayIcon from '../../assets/payment/razorpay-icon (1).svg';
import Upi from '../../assets/payment/upi.svg';
import Cod from '../../assets/payment/reshot-icon-cash-on-delivery-5UB8T6KGXR.svg';
import { useCart } from './cartHook';
import { placeOrder } from "../services/decoration-orders/order-api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserOrderDetails = ({ cartItems = [], currencySymbol, userData, discountAmount, total }) => {
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    // Form state
    const [username, setUsername] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [aptSuite, setAptSuite] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [specialNote, setSpecialNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with user data
    useEffect(() => {
        if (userData) {
            setUsername(userData.username || '');
            setContactNumber(userData.mobile || '');
            setEmail(userData.email || '');
            setAptSuite(userData.address || '');
            setStreetAddress(userData.address || '');
            setCity(userData.city || '');
            setZipCode(userData.pincode || '');
            setCountry(userData.country || '');
        }
    }, [userData]);

    const transformToOrderSchema = () => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (item.price * (item.quantity || 1)),
            0
        );

        // Generate delivery notes
        const deliveryNotes = [];
        const dateGroups = {};

        cartItems.forEach(item => {
            const dateKey = item.service_date || 'standard_delivery';
            if (!dateGroups[dateKey]) {
                dateGroups[dateKey] = [];
            }
            dateGroups[dateKey].push(item);
        });

        Object.entries(dateGroups).forEach(([date, items]) => {
            if (date === 'standard_delivery') {
                deliveryNotes.push('Standard delivery in 7-10 days');
            } else {
                const time = items[0]?.service_time || 'Not Specified';
                const productNames = items.map(item => item.name).join(', ');
                deliveryNotes.push(`Service on ${date} at ${time} (${productNames})`);
            }
        });

        return {
            userDetails: {
                userId: userData._id,
                username,
                contactNumber,
                email
            },
            addressDetails: {
                home_address: aptSuite,
                street_address: streetAddress,
                city_address: city,
                pincode: zipCode
            },
            productDetails: cartItems.map(item => ({
                productId: item.product_id,
                productName: item.name,
                amount: item.price,
                quantity: item.quantity,
                service_date: item.service_date || null,
                service_time: item.service_time || null
            })),
            paymentDetails: {
                subtotal,
                discountAmount,
                totalAmount: total,
                transactionId: null,
                transactionStatus: 'pending',
                paymentMethodType: paymentMethod
            },
            orderDetails: {
                order_status: 'pending',
                order_requested_date: cartItems.find(item => item.service_date)?.service_date || 
                    new Date().toISOString().split('T')[0],
                order_requested_time: cartItems.find(item => item.service_time)?.service_time || 
                    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                products: cartItems.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,
                    order_requested_date: item.service_date || null,
                    order_requested_time: item.service_time || null
                })),
                lastUpdated: new Date()
            },
            deliveryNotes: deliveryNotes.join('; '),
            discountApplied: discountAmount,
            shippingMethod: 'Standard Delivery'
        };
    };

    const validateFields = () => {
        const requiredFields = {
            username: username.trim(),
            contactNumber: contactNumber.trim(),
            email: email.trim(),
            aptSuite: aptSuite.trim(),
            streetAddress: streetAddress.trim(),
            city: city.trim(),
            zipCode: zipCode.trim(),
            country: country.trim()
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return false;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Validate phone number
        if (!/^\d{10,}$/.test(contactNumber)) {
            toast.error('Please enter a valid contact number (at least 10 digits)');
            return false;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;
        if (!validateFields()) return;

        setIsSubmitting(true);
        const orderData = transformToOrderSchema();

        try {
            if (paymentMethod === "razorpay") {
                const response = await placeOrder(orderData);
                const { order, razorpayOrderId } = response.data;

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY,
                    amount: total * 100,
                    currency: "INR",
                    name: "A4 CELEBRATION",
                    description: "Order Payment",
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        try {
                            const verificationResponse = await axios.post(
                                `${import.meta.env.VITE_API_URL}orders/verify-payment`,
                                {
                                    order_id: order.order_id,
                                    razorpayOrderId,
                                    payment_id: response.razorpay_payment_id,
                                    signature: response.razorpay_signature,
                                    discountAmount
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                }
                            );

                            if (verificationResponse.data.status === 'success') {
                                toast.success("Payment Successful");
                                setTimeout(() => {
                                    clearCart(userData._id);
                                    setIsSubmitting(false);
                                    navigate(`/order/${order.order_id}`);
                                }, 2000);
                            }
                        } catch (error) {
                            setIsSubmitting(false);
                            toast.error("Payment failed");
                            console.error('Payment verification failed:', error);
                        }
                    },
                    prefill: { name: username, email, contact: contactNumber },
                    theme: { color: "#F37254" },
                    modal: {
                        ondismiss: function () {
                            setIsSubmitting(false);
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                const response = await placeOrder(orderData);
                clearCart(userData._id);
                setIsSubmitting(false);
                navigate(`/order/${response.data.order.order_id}`);
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.error('Order placement failed. Please try again.');
            console.error('Order failed:', error);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handlePlaceOrder}>
            <ToastContainer />
            
            {/* Customer Details Section */}
            <div className="border-2 border-amber-200 rounded-xl shadow-lg bg-white overflow-hidden">
                <div
                    className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4 cursor-pointer"
                    onClick={() => setIsOpen1(!isOpen1)}
                >
                    <h2 className="text-amber-800 flex items-center justify-between gap-2 font-medium text-lg">
                        <span className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                                1
                            </span>
                            Your Celebration Details
                        </span>
                        {isOpen1 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </h2>
                </div>

                {!isOpen1 ? (
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-amber-800">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">Name:</span>
                                <span>{username || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">Phone:</span>
                                <span>{contactNumber || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">Email:</span>
                                <span>{email || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-amber-800 font-medium">
                                    Full Name <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="contactNumber" className="text-amber-800 font-medium">
                                    Phone <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    id="contactNumber"
                                    name="contactNumber"
                                    className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                    required
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-amber-800 font-medium">
                                Email Address <span className="text-amber-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping Address Section */}
            <div className="border-2 border-amber-200 rounded-xl shadow-lg bg-white overflow-hidden">
                <div
                    className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4 cursor-pointer"
                    onClick={() => setIsOpen2(!isOpen2)}
                >
                    <h2 className="text-amber-800 flex items-center justify-between gap-2 font-medium text-lg">
                        <span className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                                2
                            </span>
                            Celebration Venue
                        </span>
                        {isOpen2 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </h2>
                </div>

                {!isOpen2 ? (
                    <div className="p-4">
                        <div className="space-y-3 text-sm text-amber-800">
                            <div className="flex items-start gap-2">
                                <Home className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-amber-700">
                                        {aptSuite || 'Not provided'}
                                        {city && `, ${city}`}
                                        {zipCode && `, ${zipCode}`}
                                    </p>
                                </div>
                            </div>
                            {country && (
                                <div className="flex items-center gap-2">
                                    <Flag className="h-4 w-4 text-amber-600" />
                                    <span className="font-medium">Country:</span>
                                    <span>{country}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-5 w-5 text-amber-600" />
                            <p className="text-sm text-amber-800">Where should we bring the celebration magic?</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="aptSuite" className="text-amber-800 font-medium">
                                Apt/Suite/Building <span className="text-amber-500">*</span>
                            </label>
                            <input
                                id="aptSuite"
                                name="aptSuite"
                                className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                required
                                value={aptSuite}
                                onChange={(e) => setAptSuite(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="streetAddress" className="text-amber-800 font-medium">
                                Street Address <span className="text-amber-500">*</span>
                            </label>
                            <input
                                id="streetAddress"
                                name="streetAddress"
                                className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                required
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="city" className="text-amber-800 font-medium">
                                    City/Town <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="zipCode" className="text-amber-800 font-medium">
                                    Zip/Postal Code <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    id="zipCode"
                                    name="zipCode"
                                    className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                    required
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="country" className="text-amber-800 font-medium">
                                Country <span className="text-amber-500">*</span>
                            </label>
                            <input
                                id="country"
                                name="country"
                                className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Special Notes Section */}
            <div className="border-2 border-amber-200 rounded-xl shadow-lg bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4">
                    <h2 className="text-amber-800 flex items-center gap-2 font-medium text-lg">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                            3
                        </span>
                        Special Celebration Wishes
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-2">
                        <textarea
                            id="specialNote"
                            name="specialNote"
                            className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all min-h-[120px]"
                            placeholder="Tell us about your celebration dreams, special rituals, or anything we should know to make it perfect..."
                            value={specialNote}
                            onChange={(e) => setSpecialNote(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
                <div className="p-6 space-y-4 bg-white border-2 border-amber-200 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Select Payment Method</h3>

                    {/* Razorpay Option */}
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                        <input
                            type="radio"
                            id="razorpay"
                            name="payment"
                            value="razorpay"
                            checked={paymentMethod === "razorpay"}
                            onChange={() => setPaymentMethod("razorpay")}
                            className="text-amber-600 border-2 border-amber-300 focus:ring-amber-200"
                        />
                        <label htmlFor="razorpay" className="flex items-center space-x-3 cursor-pointer w-full">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <img src={RazorPayIcon} alt="Razorpay" className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Razorpay</p>
                                <p className="text-sm text-gray-500">Credit/Debit Cards, UPI, Netbanking</p>
                            </div>
                        </label>
                    </div>

                    {/* UPI Option */}
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                        <input
                            type="radio"
                            id="upi"
                            name="payment"
                            value="upi"
                            checked={paymentMethod === "upi"}
                            onChange={() => setPaymentMethod("upi")}
                            className="text-amber-600 border-2 border-amber-300 focus:ring-amber-200"
                        />
                        <label htmlFor="upi" className="flex items-center space-x-3 cursor-pointer w-full">
                            <div className="bg-purple-50 p-2 rounded-lg">
                                <img src={Upi} className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">UPI</p>
                                <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm, BHIM</p>
                            </div>
                        </label>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                        <input
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="text-amber-600 border-2 border-amber-300 focus:ring-amber-200"
                        />
                        <label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer w-full">
                            <div className="bg-green-50 p-2 rounded-lg">
                                <img src={Cod} className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Cash on Delivery</p>
                                <p className="text-sm text-gray-500">Pay when you receive your order</p>
                            </div>
                        </label>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mt-6">
                        <div className="flex items-start space-x-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="text-amber-600 border-2 border-amber-300 rounded mt-1 focus:ring-amber-200"
                                required
                            />
                            <label htmlFor="terms" className="text-sm cursor-pointer">
                                I agree to the{" "}
                                <Link to="#" className="text-amber-600 hover:underline font-medium">
                                    terms and conditions
                                </Link>{" "}
                                of this celebration booking
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isSubmitting ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Processing Your Booking...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-5 w-5" />
                        Complete Your Celebration Booking ({currencySymbol}{total.toFixed(2)})
                        <Sparkles className="h-5 w-5" />
                    </>
                )}
            </button>
        </form>
    );
};






import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Gift, NotebookIcon as Lotus, Info, Calendar, Clock, MapPin, Sparkles, PartyPopper, Heart } from "lucide-react";
import { UserOrderDetails } from "../pages/checkout/UserOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import useUserCartData from "./useUserCartData";
import { fetchUserData } from "../redux/userSlice";
import { applyCoupon } from "../services/coupon-service/coupon";
import { API } from "../utils/api"

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponCode);
      if (result.valid) {
        setCouponApplied(true);
        setDiscountAmount(result.discountValue || 0);
        setCouponMessage(result.message || "Coupon applied successfully!");
      } else {
        setCouponApplied(false);
        setDiscountAmount(0);
        setCouponMessage(result.message || "Invalid coupon code");
      }
    } catch (error) {
      setCouponApplied(false);
      setDiscountAmount(0);
      setCouponMessage("Failed to apply coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setDiscountAmount(0);
    setCouponMessage("");
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discountAmount;

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
                              src={`${API}api/${item.featured_image}`}
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
                        <span className="text-gray-600">Saving/Promo Code:</span>
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
                            className={`border-2 border-amber-300 ${
                              couponApplied 
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
                    For urgent queries: <span className="text-amber-700 font-medium">support@celebratewithus.com</span>
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