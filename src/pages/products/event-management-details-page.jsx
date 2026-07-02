import React, { useState, useEffect, useCallback } from "react";
import { Share2, Phone, Clock, ChevronLeft, ChevronRight, Check, Gift, PhoneCall, ShoppingCart, Sparkles } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/cartHook";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { Settings2Icon } from 'lucide-react';
import { TimeSlotPicker } from '../../components/delivery/DateTimePicker';
import CustomRequestModal from "./customizedProduct";
import { TimeSlotPicker2 } from "../../components/delivery/TimeSlotPicker2";
import RelatedProductSection1 from "../../components/related-products-feed/related-product-section-1";
import RelatedProductSection3 from "../../components/related-products-feed/related-product-section-3";
import useUserCartData from '../../hooks/useUserCartData';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useCustomModalData } from "../../context/CustomModalContext";
import MetaTags from "../../components/SEO/MetaTags";
import { getEventProductBySlug } from "../../services/event-management/events-management-api-service";
import {API} from "../../utils/api"

const EventManagementDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
 const { userData } = useSelector((state) => state.user);
  const { cartItems: initialCartItems, isLoading: isCartLoading } = useUserCartData();
  const { addToCart, updateItem, clearCart } = useCart();
  const { setCustomModalData } = useCustomModalData();

  const [serviceData, setServiceData] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [existingCartItem, setExistingCartItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 11,
    minutes: 27,
    seconds: 33,
  });

  // Fetch event product data by slug
  useEffect(() => {
    const fetchEventProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEventProductBySlug(slug);
        setServiceData(response.data);
        setSectionData(response.sectionData || {}); // Adjust based on your API response
        
        // Set timeLeft based on offer_ends_in if available
        if (response.data.offer_ends_in) {
          setTimeLeft(prev => ({
            ...prev,
            days: parseInt(response.data.offer_ends_in) || 0
          }));
        }
      } catch (err) {
        console.error('Error fetching event product:', err);
        setError(err.response?.data?.message || 'Failed to load event product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEventProduct();
    }
  }, [slug]);

  // Check if item is already in cart
  useEffect(() => {
    if (!isCartLoading && initialCartItems && serviceData) {
      const foundItem = initialCartItems.find(
        item => item.product_id === serviceData.product_id
      );
      if (foundItem) {
        setIsInCart(true);
        setExistingCartItem(foundItem);
      }
    }
  }, [initialCartItems, isCartLoading, serviceData]);

  const handleOpen = () => {
    if (!serviceData || !userData?.data) {
      console.warn("Required data missing to open modal.");
      return;
    }

    setCustomModalData({
      requestedEventId: serviceData.product_id,
      requestedIdName: `${serviceData.name} (Customized)`,
      productId: productId,
      userId: userData.data._id,
      name: userData.data.username,
      email: userData.data.email,
      phone: userData.data.mobile,
      requestedEventImage: serviceData.featured_image,
    });

    setShowModal(true);
  };
  
  const handleClose = () => setShowModal(false);

  // Prepare images array - combine featured image with other_images
  const images = serviceData ? [
    serviceData.featured_image,
    ...(serviceData.other_images || [])
  ].filter(img => img) : [];

  const [productId, setProductId] = useState('');

  const generateProductId = useCallback(() => {
    const prefix = 'PROD-CUSTOM-';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}${randomNum}${timestamp}`;
  }, []);

  // Countdown timer


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Convert package_includes object to array format
  const packageIncludes = serviceData?.package_includes ?
    Object.entries(serviceData.package_includes).map(([name, included]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      included
    })) : [];

  // Format price with Indian rupee symbol and commas
  const formattedPrice = serviceData ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(serviceData.price || 0).replace('₹', '₹ ') : '₹ 0';

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    // Generate the product ID once when component mounts
    setProductId(generateProductId());
  }, [generateProductId]);

  const handleBookNow = async () => {
    if (!serviceData) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    if (!isLoggedIn || !userId) {
      toast.info('Please login to book services', {
        autoClose: 1000, // Toast closes in 2 seconds
        onClose: () => navigate("/login")
      });
      return;
    }
    if (!dateTime) {
      toast.error('Please select a date and time slot');
      return;
    }

    setIsProcessing(true);

    const formattedTime = dateTime.startTime && dateTime.endTime
      ? `${dateTime.startTime} - ${dateTime.endTime}`
      : dateTime; // fallback for TimeSlotPicker2 format

    const cartItem = {
      product_id: serviceData.product_id,
      product_name: serviceData.name,
      quantity: 1, // Fixed to 1 for event management items
      service_date: dateTime.date || dateTime, // handles both picker formats
      service_time: formattedTime,
      featured_image: serviceData.featured_image,
      price: serviceData.price,
      section: 'event' // or whatever section you're using
    };

    try {
      if (isInCart) {
        // Update existing item
        await updateItem(
          userData?.data?._id,
          serviceData.product_id,
          {
            service_date: dateTime.date || dateTime,
            service_time: formattedTime
          }
        );
        toast.success('Cart details updated!');
      } else {
        await clearCart(userId)
        // Add new item
        await addToCart({
          userID: userData?.data?._id,
          items: [cartItem]
        });
        toast.success('Added to cart!');
      }

      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Image handling with fallback
  // const getImageUrl = (imagePath) => {
  //   if (!imagePath) return '/images/placeholder-product.jpg';
  //   return imagePath.startsWith('http') ? imagePath : `https://a4celebration.com/api/${imagePath}`;
  // };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Event</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show event not found state
  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }



  return (

    <>
    <MetaTags
        title="Event Management Categories | Destination Wedding, Corporate, College & Marriage Events"
        description="Explore top Event Management services in Kanpur including Destination Weddings, Marriage Events, College Functions, and Corporate Event Planning. Organize your event with professional excellence."
        keywords="Destination Wedding Planner Kanpur, Marriage Event Management, College Event Organizers, Corporate Event Planning Kanpur, Best Event Managers"
      />
  
    <div className="bg-white min-h-screen">

      <div className="bg-gradient-to-r bg-yellow-600 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
        <Gift className="h-4 w-4" />
        <span>Special Celebration Offer! Get 8% off on this service</span>
        <ChevronRight className="h-4 w-4" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Image and Description */}
          <div className="lg:col-span-7">
            {/* Image Gallery with Navigation */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg group">
              <div className="aspect-[4/3] relative">
                <img
                  src={`${API}${images[currentImageIndex]}`}
                  alt={serviceData.name || "Event Venue"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Image Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-[#FFD700] w-6" : "bg-white/70 hover:bg-white"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:col-span-5 md:hidden mt-1">
                <div className="bg-amber-50 rounded-lg shadow-lg overflow-hidden border border-[#FFD700] sticky top-2">
                  <div className="p-4 border-b border-[#FFD700]">
                    <h1 className="text-xl font-bold mb-4 text-black">Package Details</h1>

                    {/* Package Details List */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 6v6l4 2"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Price</span>
                        </div>
                        <div className="text-lg font-bold text-yellow-700">{formattedPrice}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Food Type</span>
                        </div>
                        <div className="text-black font-medium">{serviceData.food_type || 'Not specified'}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Pax</span>
                        </div>
                        <div className="text-black font-medium">{serviceData.pax || 'Not specified'}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 20h20"></path>
                              <path d="M5 20V8.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C6.52 5 7.08 5 8.2 5h7.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C19 6.52 19 7.08 19 8.2V20"></path>
                              <path d="M12 5v15"></path>
                              <path d="M8 9h1"></path>
                              <path d="M15 9h1"></path>
                              <path d="M8 13h1"></path>
                              <path d="M15 13h1"></path>
                              <path d="M8 17h1"></path>
                              <path d="M15 17h1"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Room</span>
                        </div>
                        <div className="text-black font-medium">{serviceData.room || 'Not specified'}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">City</span>
                        </div>
                        <div className="text-black font-medium">{serviceData.city || 'Not specified'}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                              <path d="M12 3v6"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Venue</span>
                        </div>
                        <div className="text-black font-medium">{serviceData.venue || 'Not specified'}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                              <path d="M16.5 9.4 7.55 4.24"></path>
                              <polyline points="3.29 7 12 12 20.71 7"></polyline>
                              <line x1="12" y1="22" x2="12" y2="12"></line>
                              <circle cx="18.5" cy="15.5" r="2.5"></circle>
                              <path d="M20.27 17.27 22 19"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Package By</span>
                        </div>
                        <div className="text-black font-medium">{serviceData.package_by || 'Not specified'}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                          </div>
                          <span className="font-medium text-black">Offer Ends In</span>
                        </div>
                        <div className="text-red-500 font-medium">
                          {timeLeft.days} Days
                       
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}

                  <div className="p-4 space-y-3">
                    <div className=" space-y-4">

                      <TimeSlotPicker2
                        onDateSelect={(selectedDate) => setDateTime(selectedDate)}

                      />
                    </div>
                    <div className="grid  gap-3">

                      <Link
                        to="https://wa.me/919336713280"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="font-medium text-sm">WhatsApp</span>
                      </Link>
                    </div>

                    {/* Updated Book Now/Go to Cart buttons */}
                    {isInCart ? (
                      <>
                        <button
                          onClick={() => navigate('/cart')}
                          className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-colors"
                        >
                          <ShoppingCart size={20} />
                          <span className="font-medium text-sm">Go to Cart</span>
                        </button>

                        <button
                          onClick={handleBookNow}
                          disabled={!dateTime}
                          className={`w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#ff1900] text-white hover:bg-[#e60000] transition-colors ${!dateTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isProcessing ? (
                            <LoadingSpinner size={20} color="text-white" />
                          ) : (
                            <>
                              <Sparkles size={20} />
                              <span className="font-medium text-sm">Update Booking</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleBookNow}
                        disabled={!dateTime || isProcessing}
                        className={`w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#ff1900] text-white hover:bg-[#e60000] transition-colors ${!dateTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? (
                          <LoadingSpinner size={20} color="text-white" />
                        ) : (
                          <>
                            <ShoppingCart size={20} />
                            <span className="font-medium text-sm">Book Now</span>
                          </>
                        )}
                      </button>
                    )}

                    <Link
                      to="tel:9336713280"
                      className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-colors"
                    >
                      <PhoneCall size={15}></PhoneCall>
                      <span className="font-medium text-sm ml-1">Package Enquiry</span>
                    </Link>

                    <div>
                      <button
                        onClick={handleOpen}
                        className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-colors"
                      >
                        <Settings2Icon />
                        <span className="font-medium text-sm">Your Customized Requirements</span>
                      </button>

                      {showModal && (
                        <CustomRequestModal onClose={() => setShowModal(false)} />
                      )}
                    </div>


                  </div>




                  {/* Special Offer */}
                  <div className="p-4 bg-gradient-to-r from-[#222222] to-black text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                      </div>
                      <h3 className="font-bold text-base">Special Offer</h3>
                    </div>
                    <p className="text-gray-300 mb-3 text-xs">
                      Book now and get a complimentary couple's photoshoot at the Taj Mahal!
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-300">
                        Use code: <span className="font-bold text-[#FFD700]">WEDDING2023</span>
                      </div>
                      <button className="text-[#FFD700] font-medium text-xs hover:underline">Copy Code</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Includes */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-black">Package Includes</h2>
              <div className="flex flex-wrap gap-3">
                {packageIncludes.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${item.included ? 'border-[#897712] bg-white hover:bg-[#FFF8E1]' : 'border-gray-300 bg-gray-100'} transition-colors group cursor-pointer`}
                  >
                    {item.included && (
                      <div className="w-5 h-5 rounded-full bg-[#ddbe10] flex items-center justify-center">
                        <Check size={12} className="text-black" />
                      </div>
                    )}
                    <span className="font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-black">Description</h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: decodeHTML(serviceData.description || 'No description available')
                }}
              />
            

              {/* Expandable Content */}
              <div className="mt-4">
                <button className="text-[#FFD700] font-medium hover:underline flex items-center">
                  Read more about this package
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Venue Features */}
            <div className="bg-black rounded-xl p-6 text-white hidden md:block">
              <h2 className="text-xl font-bold mb-4 text-[#FFD700]">Venue Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                      <path d="M12 3v6"></path>
                    </svg>
                  </div>
                  <span className="font-medium">Luxury Venue</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <span className="font-medium">Prime Location</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M2 20h20"></path>
                      <path d="M5 20V8.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C6.52 5 7.08 5 8.2 5h7.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C19 6.52 19 7.08 19 8.2V20"></path>
                      <path d="M12 5v15"></path>
                      <path d="M8 9h1"></path>
                      <path d="M15 9h1"></path>
                      <path d="M8 13h1"></path>
                      <path d="M15 13h1"></path>
                      <path d="M8 17h1"></path>
                      <path d="M15 17h1"></path>
                    </svg>
                  </div>
                  <span className="font-medium">{serviceData.room || '0'} Rooms</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M12 12c-3.5 0-7-1.5-7-4 0-3.5 3.5-7 7-7s7 3.5 7 7c0 2.5-3.5 4-7 4Z"></path>
                      <path d="M5 12v4c0 2.5 3.5 4 7 4s7-1.5 7-4v-4"></path>
                      <path d="M5 16v4c0 2.5 3.5 4 7 4s7-1.5 7-4v-4"></path>
                    </svg>
                  </div>
                  <span className="font-medium">{serviceData.pax || '0'} Pax</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">{serviceData.city || 'City'}</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">{serviceData.food_type || 'Food'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Package Details */}
          <div className="lg:col-span-5 hidden md:block">
            <div className="bg-amber-50 rounded-lg shadow-lg overflow-hidden border border-[#FFD700] sticky top-2">
              <div className="p-4 border-b border-[#FFD700]">
                <h1 className="text-xl font-bold mb-4 text-black">Package Details</h1>

                {/* Package Details List */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Price</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-700">{formattedPrice}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Food Type</span>
                    </div>
                    <div className="text-black font-medium">{serviceData.food_type || 'Not specified'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Pax</span>
                    </div>
                    <div className="text-black font-medium">{serviceData.pax || 'Not specified'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 20h20"></path>
                          <path d="M5 20V8.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C6.52 5 7.08 5 8.2 5h7.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C19 6.52 19 7.08 19 8.2V20"></path>
                          <path d="M12 5v15"></path>
                          <path d="M8 9h1"></path>
                          <path d="M15 9h1"></path>
                          <path d="M8 13h1"></path>
                          <path d="M15 13h1"></path>
                          <path d="M8 17h1"></path>
                          <path d="M15 17h1"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Room</span>
                    </div>
                    <div className="text-black font-medium">{serviceData.room || 'Not specified'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">City</span>
                    </div>
                    <div className="text-black font-medium">{serviceData.city || 'Not specified'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                          <path d="M12 3v6"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Venue</span>
                    </div>
                    <div className="text-black font-medium">{serviceData.venue || 'Not specified'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                          <path d="M16.5 9.4 7.55 4.24"></path>
                          <polyline points="3.29 7 12 12 20.71 7"></polyline>
                          <line x1="12" y1="22" x2="12" y2="12"></line>
                          <circle cx="18.5" cy="15.5" r="2.5"></circle>
                          <path d="M20.27 17.27 22 19"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Package By</span>
                    </div>
                    <div className="text-black font-medium">{serviceData.package_by || 'Not specified'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <span className="font-medium text-black">Offer Ends In</span>
                    </div>
                    <div className="text-red-500 font-medium">
                      {timeLeft.days} Days, {String(timeLeft.hours).padStart(2, "0")}:
                      {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="p-4 space-y-3">
                <div className=" space-y-4">

                  <TimeSlotPicker2
                    onDateSelect={(selectedDate) => setDateTime(selectedDate)}

                  />
                </div>
                <div className="grid ">




                  <Link
                    to="https://wa.me/919336713280"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="font-medium text-sm">WhatsApp</span>
                  </Link>

                </div>



                {isInCart ? (
                  <>
                    <button
                      onClick={() => navigate('/cart')}
                      className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-colors"
                    >
                      <ShoppingCart size={20} />
                      <span className="font-medium text-sm">Go to Cart</span>
                    </button>
                    {console.log(dateTime)}
                    <button
                      onClick={handleBookNow}
                      disabled={!dateTime}
                      className={`w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#ff1900] text-white hover:bg-[#e60000] transition-colors ${!dateTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? (
                        <LoadingSpinner size={20} color="text-white" />
                      ) : (
                        <>
                          <Sparkles size={20} />
                          <span className="font-medium text-sm">Update Booking</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleBookNow}
                    disabled={!dateTime || isProcessing}
                    className={`w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#ff1900] text-white hover:bg-[#e60000] transition-colors ${!dateTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? (
                      <LoadingSpinner size={20} color="text-white" />
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span className="font-medium text-sm">Book Now</span>
                      </>
                    )}
                  </button>
                )}
                <Link
                  to="tel:9336713280"
                  className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-colors"
                >
                  <PhoneCall size={15}></PhoneCall>
                  <span className="font-medium text-sm ml-1">Package Enquiry</span>
                </Link>


                <div>
                  <button
                    onClick={handleOpen}
                    className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-full bg-[#FFD700] text-black hover:bg-[#E6C200] transition-colors"
                  >
                    <Settings2Icon />
                    <span className="font-medium text-sm">Your Customized Requirements</span>
                  </button>

                  {showModal && (

                    
                    <CustomRequestModal
                      productId={productId}  // replace with actual productId if needed
                      userId={userData?.data?._id}      // replace with actual userId if needed
                      onClose={handleClose}
                    />
                  )}
                </div>

              </div>

              {/* Special Offer */}
              
            </div>
          </div>
        </div>

      </div>
      <h2 className="text-3xl font-bold text-center google-font mt-4">
        <span className="border-b-[1vw] border-amber-700 rounded-md inline-block">
          Related Services
        </span>
      </h2>
      <div className="space-y-4 pb-6">
        <RelatedProductSection3></RelatedProductSection3>

      </div>
      <ToastContainer></ToastContainer>
    </div>
      </>
  )
}

export default EventManagementDetailsPage