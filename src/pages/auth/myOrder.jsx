import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Lightbulb,
  Gift,
  Cake,
  PartyPopper,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  X,
} from "lucide-react";
import { getOrdersByUserId } from "../../services/decoration-orders/order-api";
import useMultipleProductDetails from "../../hooks/useMultipleProductDetails";
import useGiftHook from "../../hooks/useGiftHooks";
import { getProductById } from "../../services/decorations/product-api-service";
import { getEventByProductId } from "../../services/event-management/events-management-api-service";

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";

import axios from "axios";
export default function MyOrders({ userData }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate=useNavigate()

  const [showCancelModal, setShowCancelModal] = useState(false);
const [selectedOrderId, setSelectedOrderId] = useState(null);
const [cancellationReason, setCancellationReason] = useState('');


  // Static image URL for all products
  const { fetchGiftById } = useGiftHook();

  const [productImages, setProductImages] = useState({});

  const staticImageUrl = "https://cheetah.cherishx.com/uploads/1680590693_original.jpg?format=avif&width=384&height=384";

  const fetchData = async (id) => {

    if (id.startsWith("PROD-DECORATION")) {
      const product = await getProductById(id);

      return API + product.data.featured_image;
    }

    else if (id.startsWith("PROD-EVENT")) {

      const product = await getEventByProductId(id);

      return API + product.data.featured_image;

    }



    else if (id.startsWith("PROD-GIFT")) {

      const product = await fetchGiftById(id);

      return API + product.data.featured_image;

    }

    else {
      return staticImageUrl;
    }




  };



  const [customOrder, setCustomOrder] = useState([]);
 const fetchOrders = async () => {
  try {
    const response = await getOrdersByUserId(userData.data._id);
    const allOrders = response.data;

    const customOrders = allOrders.filter(order =>
      order.orderDetails.products.some(product => product.productId.startsWith("PROD-CUSTOM"))
    );

    const normalOrders = allOrders.filter(order =>
      !order.orderDetails.products.some(product => product.productId.startsWith("PROD-CUSTOM"))
    );

    setOrders(normalOrders);
    setCustomOrder(customOrders);

    const imageUrls = {};
    for (const order of allOrders) {
      for (const product of order.productDetails) {
        if (!imageUrls[product.productId]) {
          try {
            imageUrls[product.productId] = await fetchData(product.productId);
          } catch (error) {
            console.error(`Failed to fetch image for ${product.productId}:`, error);
            imageUrls[product.productId] = staticImageUrl;
          }
        }
      }
    }

    setProductImages(imageUrls);
    setIsLoading(false);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    setIsLoading(false);
  }
};
useEffect(() => {
  if (userData?.data?._id) {
    fetchOrders();
  }
}, [userData]);


  

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 mr-1" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500 mr-1" />;
      default:
        return <Package className="w-4 h-4 text-gray-500 mr-1" />;
    }
  };




  function handleTrackClick (orderID){
    navigate(`${orderID}`)
 
};

 const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

const handleCancelOrder = async () => {
  if (!cancellationReason.trim()) {
    toast.warning("Cancellation reason is required");
    return;
  }

  try {
    await axios.put(
      `${API_URL}order/cancel-order-status/${selectedOrderId}`,
      { cancellationReason },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    toast.success("Order cancelled successfully");
    setShowCancelModal(false);
    setCancellationReason('');
    fetchOrders(); // <-- refresh order list after cancellation
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to cancel order");
  }
};





  if (isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl space-y-4 rounded-lg border border-gray-200 bg-white py-4 shadow text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl space-y-4 rounded-lg border border-gray-200 bg-white py-4 shadow">
       <ToastContainer position="top-center" autoClose={2000} />
      <div className="flex items-center justify-center mb-2">
        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mr-2 sm:mr-3" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800">
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <div className="flex justify-center mb-4">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-amber-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">You have no orders yet</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Your orders will appear here once you make a purchase.
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table View */}
          <table className="w-full hidden sm:table">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Order Details</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Date & Time</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-b border-amber-100 hover:bg-amber-50">
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      {order.productDetails.map((product, index) => (
                        <div key={index} className="flex items-center mb-2 sm:mb-3">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden bg-gray-100 mr-3 sm:mr-4">
                            <img
                              src={productImages[product.productId] || staticImageUrl}
                              alt={product.productName}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.src = staticImageUrl;
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm sm:text-base">
                              {product.productName}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Qty: {product.quantity} × ₹{product.amount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-2">
                    <p className="font-medium text-sm sm:text-base">{order.order_id}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {order.paymentDetails.paymentMethodType === 'cod' ? 'COD' : 'Paid'}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-sm sm:text-base">{order.orderDetails.order_requested_date}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {order.orderDetails.order_requested_time}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      {getStatusIcon(order.orderDetails.order_status)}
                      <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${order.orderDetails.order_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.orderDetails.order_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {order.orderDetails.order_status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-medium text-sm sm:text-base">
                    ₹{order.paymentDetails.totalAmount}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex space-x-2">
                      <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded flex items-center text-xs sm:text-sm" onClick={() =>handleTrackClick(order.order_id) } >
                        <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"/>
                        Track
                      </button>
                    {(order.orderDetails.order_status === 'processing' || order.orderDetails.order_status === 'pending') && (
  <button
    className="border border-gray-200 hover:bg-gray-100 text-gray-500 font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded flex items-center text-xs sm:text-sm"
    onClick={() => {
      setSelectedOrderId(order._id);
      setShowCancelModal(true);
    }}
  >
    <X className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
    
  </button>
)}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border-b border-amber-100 p-3 hover:bg-amber-50 rounded-lg">
                <div className="flex">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-3 relative">
                    <img
                      src={productImages[order.productDetails[0].productId] || staticImageUrl}
                      alt={order.productDetails[0].productName}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = staticImageUrl;
                        e.target.onerror = null;
                      }}
                    />
                    {order.productDetails.length > 1 && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        +{order.productDetails.length - 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {order.productDetails[0].productName}
                        {order.productDetails.length > 1 && ` + ${order.productDetails.length - 1} more`}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Qty: {order.productDetails.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>

                    <div className="mb-1">
                      <p className="text-xs font-medium">Order ID: {order.order_id}</p>

                      <p className="text-gray-600 text-xs sm:text-sm">
                        {order.paymentDetails.paymentMethodType === 'cod' ? 'COD' : 'Paid'}
                      </p>

                      <p className="text-gray-600 text-xs">
                        {order.orderDetails.order_requested_date} at {order.orderDetails.order_requested_time}
                      </p>

                    </div>

                    <div className="flex items-center mb-1">
                      {getStatusIcon(order.orderDetails.order_status)}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${order.orderDetails.order_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.orderDetails.order_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {order.orderDetails.order_status}
                      </span>
                    </div>

                    <p className="font-semibold text-sm">Total: ₹{order.paymentDetails.totalAmount}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-2">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1 px-2 rounded flex items-center text-xs" onClick={() =>handleTrackClick(order.order_id) }>
                    <Truck className="w-3 h-3 mr-1" />
                    Track
                  </button>
                  {order.orderDetails.order_status === 'processing' && (
                    <button
                      className="border border-gray-200 hover:bg-gray-100 text-gray-500 font-semibold py-1 px-2 rounded flex items-center text-xs"
                      onClick={() => cancelOrder(order._id)}
                    >
                      <X className="w-3 h-3 text-amber-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-10 flex justify-between items-center">
        <div className="flex items-center text-amber-500">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm font-medium">Your order history</span>
        </div>
      </div>

      {showCancelModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
    <div className="bg-white rounded p-6 w-[90%] max-w-md shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
      <textarea
        className="w-full border p-2 rounded mb-4"
        rows="4"
        placeholder="Enter cancellation reason"
        value={cancellationReason}
        onChange={(e) => setCancellationReason(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-4 rounded"
          onClick={() => setShowCancelModal(false)}
        >
          Close
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded"
          onClick={() => handleCancelOrder()}
        >
          Confirm Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}