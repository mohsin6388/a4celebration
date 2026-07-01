import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { API } from "../../utils/api";

const MyArtistOrders = ({ userData }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const token = import.meta.env.VITE_API_KEY; // 'all', 'pending', 'confirmed', 'completed', 'cancelled'

  useEffect(() => {
    if (userData?.data?._id) {
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(
            `${API}api/api/get/artist/${userData.data._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`
              },
            }
          );
          const data = await res.json();
          if (data.success) {
            setOrders(data.booking);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [userData]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.orderStatus?.toLowerCase() === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <span className="mr-3 text-yellow-500">🎤</span> My Artist Requests
          </h1>
          <p className="text-gray-600">View your artist booking requests and their status</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-gray-700">Total Requests</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(order => order.orderStatus?.toLowerCase() === 'confirmed').length}
            </div>
            <div className="text-gray-700">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(order => order.orderStatus?.toLowerCase() === 'pending').length}
            </div>
            <div className="text-gray-700">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(order => order.orderStatus?.toLowerCase() === 'completed').length}
            </div>
            <div className="text-gray-700">Completed</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${filterStatus === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilterStatus('all')}
          >
            All Requests
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${filterStatus === 'confirmed' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${filterStatus === 'completed' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${filterStatus === 'cancelled' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filterStatus === 'all' ? 'No requests found' : `No ${filterStatus} requests`}
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? "You haven't made any artist requests yet." 
                : `You don't have any ${filterStatus} requests.`}
            </p>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{order.artistName}</h3>
                      <p className="text-yellow-600 font-medium">{order.occasion} • {order.concert}</p>
                       {order.message && (
    <div className="mt-2 flex items-center gap-1 text-red-500">
      <AlertCircle className="text-sm" />
      <span className="underline font-medium">{order.message}</span>
    </div>
  )}
                      
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  {/* Event Details */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="truncate">{order.eventLocation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {formatDate(order.eventDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formatCurrency(order.budget)} • {order.attendees} attendees
                    </div>
                  </div>
                  
                  {/* Payment Status */}
                  <div className="mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-800 mb-1">Your contact details:</div>
                    <div className="text-sm text-gray-600 mb-1">{order.clientName}</div>
                    <div className="text-sm text-gray-600">{order.mobile} • {order.email}</div>
                  </div>
                  
                  {/* View Details Button */}
                  <div className="mt-4">
                    <button 
                      className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15.5v-11a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedOrder(null)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Artist</div>
                      <div className="text-gray-900">{selectedOrder.artistName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Occasion</div>
                      <div className="text-gray-900">{selectedOrder.occasion}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Concert Type</div>
                      <div className="text-gray-900">{selectedOrder.concert}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="text-gray-900">{selectedOrder.eventLocation}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Date</div>
                      <div className="text-gray-900">{formatDate(selectedOrder.eventDate)}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Your Name</div>
                      <div className="text-gray-900">{selectedOrder.clientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Contact</div>
                      <div className="text-gray-900">{selectedOrder.mobile}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="text-gray-900">{selectedOrder.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Budget</div>
                      <div className="text-gray-900">{formatCurrency(selectedOrder.budget)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Attendees</div>
                      <div className="text-gray-900">{selectedOrder.attendees}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.orderStatus)}`}>
                      Request Status: {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                      Payment: {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArtistOrders;