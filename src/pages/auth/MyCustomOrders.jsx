import React, { useEffect, useState } from 'react';
import { getCustomizedRequests } from '../../services/customized-products/customized-api-service';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../utils/api';

const MyCustomOrders = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(requests)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getCustomizedRequests();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);
  console.log(requests)
  const navigate = useNavigate()
  const handleBookNow = (requestId) => {
    // Implement your booking logic here
    navigate("/checkout/" + requestId)
  };


  function handleTrackOrder(orderID) {
    navigate(`custom/${orderID}`)

  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center space-x-3">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              My Customized Orders
            </h1>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-2 sm:p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No customized orders found.</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-amber-500 to-amber-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Event Info</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Preferences</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {req.requestedEventImage && (
                              <div className="flex-shrink-0 h-16 w-16 mr-4">
                                <img
                                  className="h-full w-full rounded-md object-cover"
                                  src={`${API}api/${req.requestedEventImage}`}
                                  alt={req.requestedIdName}
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{req.requestedIdName}</div>
                              <div className="flex items-center mt-1">
                                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-sm text-gray-600">{req.name}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm text-gray-600">{req.phone_number}</span>
                              </div>
                              {req.email && (
                                <div className="flex items-center mt-1">
                                  <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-600 truncate max-w-xs">{req.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(req.event_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {req.guest_count} {req.guest_count === 1 ? 'guest' : 'guests'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">{req.food_preference}</div>
                          <div className="text-sm text-gray-600 mt-1">{req.budget_range}</div>
                          {req.special_requirements && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-amber-400" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx={4} cy={4} r={3} />
                                </svg>
                                Special Requests
                              </span>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {req.special_requirements}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${req.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(req.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {req.status === 'approved' ? (
                            <div>
                              <div className="text-lg font-bold text-gray-900">
                                ₹{req.final_price?.toLocaleString('en-IN') || '--'}
                              </div>
                              {req.quoted_price && req.quoted_price !== req.final_price && (
                                <div className="text-xs text-gray-400 line-through">
                                  ₹{req.quoted_price.toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">--</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col space-y-2">
                            {req.status === 'approved' && (
                              <button
                                onClick={() => handleBookNow(req._id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                              >
                                Book Now
                              </button>
                            )}
                            {req.status === 'pending' && (
                              <button
                                disabled
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-yellow-700 bg-yellow-100 cursor-not-allowed"
                              >
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Pending
                              </button>
                            )}
                            {req.status === 'rejected' && (
                              <button
                                disabled
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-red-700 bg-red-100 cursor-not-allowed"
                              >
                                Rejected
                              </button>
                            )}
                            {(req.status === 'completed' || req.status === 'confirmed') && (
                              <span>Track from CUSTOM ORDERS HISTORY &rarr;</span>

                            )}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              {/* Mobile Cards - Enhanced */}
              <div className="sm:hidden space-y-4">
                {requests.map((req) => (
                  <div key={req._id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    {/* Card Header with Image */}
                    {req.requestedEventImage && (
                      <div className="h-40 w-full relative">
                        <img
                          className="h-full w-full object-cover"
                          src={`${API}api/${req.requestedEventImage}`}
                          alt={req.requestedIdName}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <h3 className="text-white font-semibold text-sm truncate">{req.requestedIdName}</h3>
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-3">
                      {/* User Details */}
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-gray-900">{req.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {req.phone_number}
                        </div>
                        {req.email && (
                          <div className="flex items-center text-sm text-gray-600 truncate">
                            <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {req.email}
                          </div>
                        )}
                      </div>

                      {/* Event Info & Status */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(req.event_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {req.guest_count} {req.guest_count === 1 ? 'guest' : 'guests'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${req.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(req.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-500">Food:</span>
                          <span className="text-gray-900">{req.food_preference}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-500">Budget:</span>
                          <span className="text-gray-900">{req.budget_range}</span>
                        </div>
                        {req.special_requirements && (
                          <div className="pt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-amber-400" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx={4} cy={4} r={3} />
                              </svg>
                              Special Requests
                            </span>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {req.special_requirements}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      {req.status === 'approved' && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Final Price:</span>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ₹{req.final_price?.toLocaleString('en-IN') || '--'}
                              </p>
                              {req.quoted_price && req.quoted_price !== req.final_price && (
                                <p className="text-xs text-gray-400 line-through">
                                  ₹{req.quoted_price.toLocaleString('en-IN')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-3 space-y-2">
                        {req.status === 'approved' && (
                          <button
                            onClick={() => handleBookNow(req._id)}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Book Now
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-700 bg-yellow-100 cursor-not-allowed"
                          >
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Pending Approval
                          </button>
                        )}
                        {req.status === 'rejected' && (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-red-700 bg-red-100 cursor-not-allowed"
                          >
                            Rejected
                          </button>
                        )}
                        {(req.status === 'completed' || req.status === 'confirmed') && (
                          <button
                            onClick={() => handleTrackOrder(req.product_id
                            )}
                            className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${req.status === 'completed'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-purple-600 hover:bg-purple-700'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${req.status === 'completed'
                                ? 'focus:ring-blue-500'
                                : 'focus:ring-purple-500'
                              }`}
                          >
                            Track Order
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{requests.length}</span> orders
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCustomOrders;