import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../../services/decoration-orders/order-api';
import { CheckCircle, Truck, CreditCard, Package, User, MapPin, Calendar, Clock } from "lucide-react"
import ReceiptDownloadButton from './Receipt-order';
export default function OrderConfirmation() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrderData(data?.data); // Using optional chaining
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const formatAddress = () => {
    if (!orderData?.addressDetails) return 'No address provided';
    const { home_address, street_address, city_address, pincode } = orderData.addressDetails;
    return `${home_address}, ${street_address}, ${city_address}, ${pincode}`;
  }

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-amber-100 text-amber-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orderData) return <div>No order data found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className="flex flex-col items-center justify-center mb-8 pt-8">
          <div
            className={`mb-4 transform transition-all duration-700 ease-out ${isLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
          >
            <CheckCircle className="w-24 h-24 text-amber-500" />
          </div>

          <h1
            className={`text-3xl md:text-4xl font-bold text-amber-700 text-center transform transition-all duration-500 delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            Thank You for Your Order!
          </h1>

          <div
            className={`mt-2 text-center transition-opacity duration-500 delay-500 ${isLoaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <p className="text-lg text-gray-600">
              Your order <span className="font-semibold text-amber-600">{orderData?.order_id || 'N/A'}</span> has been confirmed
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div
          className={`transform transition-all duration-500 delay-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          <div className="mb-6 border border-amber-200 rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-200">
              <div className="flex items-center text-amber-700 font-semibold text-lg">
                <Package className="mr-2 h-5 w-5" />
                Order Status
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData?.orderDetails?.order_status)
                      } capitalize`}
                  >
                    {orderData?.orderDetails?.order_status || 'Unknown'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Last updated: {orderData?.orderDetails?.lastUpdated ?
                      new Date(orderData.orderDetails.lastUpdated).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Order ID: <span className="font-medium">{orderData?.order_id || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div
            className={`transform transition-all duration-500 delay-[800ms] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <div className="border border-amber-200 rounded-lg shadow-sm h-full">
              <div className="bg-amber-50 p-4 border-b border-amber-200">
                <div className="flex items-center text-amber-700 font-semibold text-lg">
                  <User className="mr-2 h-5 w-5" />
                  Customer Details
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-gray-900">{orderData?.userDetails?.username || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{orderData?.userDetails?.email || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{orderData?.userDetails?.contactNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div
            className={`transform transition-all duration-500 delay-[900ms] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <div className="border border-amber-200 rounded-lg shadow-sm h-full">
              <div className="bg-amber-50 p-4 border-b border-amber-200">
                <div className="flex items-center text-amber-700 font-semibold text-lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Shipping Address
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <p className="text-gray-700">{formatAddress()}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Shipping Method:</span> {orderData?.shippingMethod || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div
            className={`transform transition-all duration-500 delay-[1000ms] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <div className="border border-amber-200 rounded-lg shadow-sm h-full">
              <div className="bg-amber-50 p-4 border-b border-amber-200">
                <div className="flex items-center text-amber-700 font-semibold text-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Delivery Information
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <p className="text-gray-700">
  {orderData?.orderDetails?.products?.[0]?.order_requested_date
    ? `Requested Date: ${new Date(orderData.orderDetails.products[0].order_requested_date)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-")}`
    : `Notes: ${orderData?.deliveryNotes || "No delivery notes available"}`}
</p>


                    {console.log(orderData?.orderDetails.products[0].order_requested_date
)}
                    {console.log(orderData?.deliveryNotes)}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Order Date:</span> {orderData?.orderDetails?.order_requested_date || 'N/A'} at{" "}
                      {orderData?.orderDetails?.order_requested_time || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div
            className={`transform transition-all duration-500 delay-[1100ms] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <div className="border border-amber-200 rounded-lg shadow-sm h-full">
              <div className="bg-amber-50 p-4 border-b border-amber-200">
                <div className="flex items-center text-amber-700 font-semibold text-lg">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Method:</span> {orderData?.paymentDetails?.paymentMethodType || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Status:</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(orderData?.paymentDetails?.transactionStatus)
                        }`}
                    >
                      {orderData?.paymentDetails?.transactionStatus || 'Unknown'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          className={`mt-6 transform transition-all duration-500 delay-[1200ms] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          <div className="border border-amber-200 rounded-lg shadow-md">
            <div className="bg-amber-50 p-4 border-b border-amber-200">
              <div className="flex items-center text-amber-700 font-semibold text-lg">
                <Truck className="mr-2 h-5 w-5" />
                Order Summary
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {orderData?.productDetails?.length ? (
                  orderData.productDetails.map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-amber-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-amber-100 rounded-md flex items-center justify-center mr-4">
                          <Package className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product?.productName || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500">Qty: {product?.quantity || 0}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">₹{product?.amount || 0}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 py-4 text-center">No products found in this order</p>
                )}

                <div className="pt-2">
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{orderData?.paymentDetails?.totalAmount || 0}</p>
                  </div>
                  {orderData?.discountApplied > 0 && (
                    <div className="flex justify-between py-2">
                      <p className="text-gray-600">Discount</p>
                      <p className="font-medium text-green-600">-₹{orderData.discountApplied}</p>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">Free</p>
                  </div>
                  <div className="h-px w-full bg-amber-100 my-2"></div>
                  <div className="flex justify-between py-2">
                    <p className="font-semibold text-lg">Total</p>
                    <p className="font-bold text-lg text-amber-700">₹{orderData?.paymentDetails?.totalAmount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div
          className={`mt-8 mb-12 text-center transform transition-all duration-500 delay-[1300ms] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
          <p className="text-gray-600 mb-4">
            We'll notify you when your order ships. You can track your order status anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link 
  to="/profile" 
  className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
>
  Track Order
</Link>
            <ReceiptDownloadButton orderData={orderData} />
            <Link
              to="/"
              className="px-6 py-2 bg-white border border-amber-300 text-amber-600 rounded-md hover:bg-amber-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}