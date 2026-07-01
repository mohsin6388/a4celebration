import { ArrowLeft, Gift, NotebookIcon as Lotus, Info, Calendar, Clock, MapPin, Sparkles, PartyPopper, Heart, Navigation, Home, Flag } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { User, Phone, Mail } from "lucide-react";
import RazorPayIcon from '../../assets/payment/razorpay-icon (1).svg';
import Upi from '../../assets/payment/upi.svg';
import Cod from '../../assets/payment/reshot-icon-cash-on-delivery-5UB8T6KGXR.svg';
import { useCart } from '../../hooks/cartHook';
import { placeOrder } from "../../services/decoration-orders/order-api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaExclamationTriangle } from "react-icons/fa";


const NotProvidedWarning = () => {
    return (
        <div className="inline-flex items-center gap-1 text-red-600 font-medium">
            <FaExclamationTriangle className="text-red-500" />
            <span>Not provided</span>
        </div>
    );
};


export const UserOrderDetails = ({ cartItems = [], currencySymbol, userData, discountAmount = 0, // Add this
    total }) => {
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    // State for input fields
    const [username, setUsername] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [aptSuite, setAptSuite] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const[CartPin, setCartPin] = useState(false);
    useEffect(() => {
        if (cartItems && cartItems.length > 0 && cartItems[0]?.pinCode) {
            console.log(cartItems);
            setCartPin(true)
            setZipCode(cartItems[0]?.pinCode);

        } else {
            setZipCode(userData?.pincode || '');
        }
    }, [cartItems, userData]);





    useEffect(() => {
        if (userData) {
            setUsername(userData.username || '');
            setContactNumber(userData.mobile || '');
            setEmail(userData.email || '');
            setAptSuite(userData.address || '');
            setStreetAddress(userData.address || '');
            setCity(userData.city || '');

            setCountry(userData.country || '');
        }
    }, [userData]);

    const [specialNote, setSpecialNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);

    const transformToOrderSchema = () => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (item.price * (item.quantity || 1)),
            0
        );

        // Generate delivery notes by grouping products with similar service dates
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
                deliveryNotes.push('Your order will be delivered in 7 to 10 days');
            } else {
                const time = items[0]?.service_time || 'Not Specified';
                const productNames = items.map(item => item.name).join(', ');
                deliveryNotes.push(`Service requested for ${date} between ${time} (${productNames})`);
            }
        });

        const orderData = {
            userDetails: {
                userId: userData._id,
                username: username,
                contactNumber: contactNumber,
                email: email
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
                service_date: item.service_date || 'Not Applicable',
                service_time: item.service_time || 'Not Specified'
            })),
            paymentDetails: {
                subtotal: subtotal, // Add this
                discountAmount: discountAmount, // Add this
                totalAmount: total, // Change this from totalAmount to total

                transactionId: null,
                transactionStatus: 'pending',
                transactionDate: null,
                paymentMethodType: paymentMethod,
            },
            orderDetails: {
                order_status: 'pending', // Overall order status
                // Use the earliest service date if available, otherwise current date
                order_requested_date: cartItems.find(item => item.service_date)?.service_date ||
                    new Date().toISOString().split('T')[0],
                // Use the first service time if available
                order_requested_time: cartItems.find(item => item.service_time)?.service_time ||
                    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                products: cartItems.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,

                    order_requested_date: item.service_date || null,
                    order_requested_time: item.service_time || null,
                    lastUpdated: new Date()
                })),
                lastUpdated: new Date()
            },
            deliveryNotes: deliveryNotes.join('; '),
            discountApplied: discountAmount,
            shippingMethod: 'Standard Delivery'
        };

        return orderData;
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Validate phone number (basic check for at least 10 digits)
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(contactNumber)) {
            toast.error('Please enter a valid contact number (at least 10 digits)');
            return false;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return false;
        }

        return true;
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

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
                                    razorpayOrderId: razorpayOrderId,
                                    payment_id: response.razorpay_payment_id,
                                    signature: response.razorpay_signature
                                },
                                {
                                    headers: {
                                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbmF5IiwiaWF0IjoxNzQ0OTY2MzI0fQ.bHVez4j2ksigzKlm7G3G7OlzrlkgAIwN6cPZySRvdCI'
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
                            alert(error.response?.data?.message || 'Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: { name: username, email, contact: contactNumber },
                    theme: { color: "#F37254" },
                    modal: {
                        ondismiss: function () {
                            setIsSubmitting(false);
                            alert('Payment window closed. Your order is not confirmed.');
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
            console.error('Order failed:', error);
            toast.error('Order placement failed. Please try again.');
        }
    };




    return (
        < form className="space-y-6" onSubmit={handlePlaceOrder}>
            <ToastContainer />
            {/* Customer Details */}
            <div className="border-2 border-amber-200 rounded-xl shadow-lg bg-white overflow-hidden">
                <div
                    className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4 cursor-pointer"
                    onClick={() => setIsOpen1(!isOpen1)}
                >
                    <h2 className="text-amber-800 flex items-center justify-between gap-2 font-playfair text-lg">
                        <span className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                                1
                            </span>
                            Your Celebration Details ✨
                        </span>
                        {isOpen1 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </h2>
                </div>

                {/* Summary view when closed */}
                {!isOpen1 && (
                    <div className="p-4 bg-amber-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-amber-800">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">Name:</span>
                                <span>{username || <NotProvidedWarning></NotProvidedWarning>}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">Phone:</span>
                                <span>{contactNumber || <NotProvidedWarning></NotProvidedWarning>}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">Email:</span>
                                <span>{email || <NotProvidedWarning></NotProvidedWarning>}</span>
                            </div>
                        </div>
                    </div>
                )}

                {isOpen1 && (
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
                                    placeholder="Your beautiful name"
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
                                    placeholder="Where we can reach you"
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
                                placeholder="For booking confirmation 💌"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping Address */}
            <div className="border-2 border-amber-200 rounded-xl shadow-lg bg-white overflow-hidden">
                <div
                    className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4 cursor-pointer"
                    onClick={() => setIsOpen2(!isOpen2)}
                >
                    <h2 className="text-amber-800 flex items-center justify-between gap-2 font-playfair text-lg">
                        <span className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                                2
                            </span>
                            Celebration Venue 🏡
                        </span>
                        {isOpen2 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </h2>
                </div>

                {!isOpen2 && (
                    <div className="p-4 bg-amber-10">
                        <div className="space-y-3 text-sm text-amber-800">
                            <div className="flex items-start gap-2">
                                <Home className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-amber-700">
                                        {aptSuite || <NotProvidedWarning></NotProvidedWarning>}
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
                )}

                {isOpen2 && (
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
                                placeholder="Your celebration spot"
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
                                placeholder="Where the party's at!"
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
                                    placeholder="Your city of joy"
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
    placeholder="Postal code"
    value={zipCode}
    onChange={(e) => setZipCode(e.target.value)}
    readOnly={!!CartPin}
/>


                            </div>

                        </div>
                        {console.log(CartPin, "in ui ")}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="country" className="text-amber-800 font-medium">
                                    Country <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    className="w-full border-2 border-amber-200 rounded-lg p-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                    required
                                    placeholder="Your country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Special Notes */}
            <div className="border-2 border-amber-200 rounded-xl shadow-lg bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-amber-100 to-amber-100 border-b border-amber-200 p-4">
                    <h2 className="text-amber-800 flex items-center gap-2 font-playfair text-lg">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                            3
                        </span>
                        Special Celebration Wishes 💫
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
                                <img src={RazorPayIcon} alt="Razorpay" style={{ width: '100px' }} className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Razorpay</p>
                                <p className="text-sm text-gray-500">Credit/Debit Cards, UPI, Netbanking</p>
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
                                <img src={Cod} style={{ width: '100px' }} className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Cash on Delivery</p>
                                <p className="text-sm text-gray-500">Pay when you receive your order</p>
                            </div>
                        </label>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-6">
                        <div className="p-6 space-y-4 bg-white border-amber-200 rounded-xl shadow-sm">
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

                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="offers"
                                    className="text-amber-600 border-2 border-amber-300 rounded mt-1 focus:ring-amber-200"
                                />
                                <label htmlFor="offers" className="text-sm cursor-pointer">
                                    Yes! I want to receive exclusive celebration offers and updates 💌
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
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
                        Complete Your Celebration Booking
                        <Sparkles className="h-5 w-5" />
                    </>
                )}
            </button>
        </form>
    );
};