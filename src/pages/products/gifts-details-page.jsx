import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, ChevronRight, Gift, Sparkles, Plus, Minus } from 'lucide-react';
import DeliveryInfo from '../../components/delivery/DeliveryInfo';
import PincodeDeliveryChecker from '../../components/delivery/Delivery-date';
import RelatedProductSection2 from '../../components/related-products-feed/related-product-section-2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../hooks/cartHook';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import DescriptionOverview from '../../components/product/description-overview';
import KitsOverview from '../../components/product/kits-overview';
import { useSelector } from "react-redux";
import RelatedSectionCardA from '../../components/related-products-feed/related-section-cardA';
import useUserCartData from '../../hooks/useUserCartData';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import GiftWishlistButton from '../wishlist/giftWishlistButton';
import CompactRating from '../../components/ratings/RatingWithReviews';
import CompactReviewSlider from '../../components/ratings/Rating';
import MetaTags from '../../components/SEO/MetaTags';
import { getGiftProductBySlug } from '../../services/giftings/gifting-api-service';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
  
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  
  .font-playfair {
    font-family: 'Playfair Display', serif;
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .product-shadow {
    box-shadow: 0 10px 25px -5px rgba(244, 114, 182, 0.2);
  }
  
  .thumbnail-active {
    border-color: #f59e0b;
    transform: scale(1.05);
  }
`;

const GiftsDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [serviceData, setServiceData] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartStatus, setCartStatus] = useState({
    isInCart: false,
    existingItem: null
  });

  const { userData } = useSelector((state) => state.user);
  const { cartItems: initialCartItems, isLoading: isCartLoading } = useUserCartData();
  const { addToCart, updateItem, clearCart } = useCart();

  // Fetch product by slug when component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getGiftProductBySlug(slug);
        setServiceData(response.data);
        setMainImage(response.data.featured_image);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug]);

  // Check if item is already in cart - ONLY when serviceData is available
  useEffect(() => {
    if (!isCartLoading && initialCartItems && serviceData) {
      const foundItem = initialCartItems.find(
        item => item.product_id === serviceData.product_id
      );
      if (foundItem) {
        setCartStatus({
          isInCart: true,
          existingItem: foundItem
        });
        setQuantity(foundItem.quantity || 1);
      } else {
        setCartStatus({
          isInCart: false,
          existingItem: null
        });
      }
    }
  }, [initialCartItems, isCartLoading, serviceData]);

  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, 99));
  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleBookNow = async () => {
    if (!serviceData) return;
    
    if (!pincode) {
      toast.error('Please enter your pincode');
      return;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');
    
    if (!isLoggedIn || !userId) {
      toast.info('Please login to book gift items', {
        autoClose: 1000,
        onClose: () => navigate("/login")
      });
      return;
    }

    setIsProcessing(true);

    const cartItem = {
      product_id: serviceData.product_id,
      product_name: serviceData.name,
      quantity: quantity,
      pinCode: pincode,
      featured_image: serviceData.featured_image,
      price: serviceData.price,
      service_date: null,
      service_time: null,
      section: 'gifting'
    };

    try {
      if (cartStatus.isInCart) {
        // Update existing item
        await updateItem(
          userData?.data?._id,
          serviceData.product_id,
          {
            quantity: quantity,
            pinCode: pincode,
            service_date: null,
            service_time: null
          }
        );
        toast.success('Cart updated successfully!');
      } else {
        await clearCart(userId);
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
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to update cart';
      toast.error(errorMessage);
      console.error('Cart error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const changeImage = (src) => {
    setMainImage(src);
  };

  const calculateDiscount = () => {
    if (!serviceData?.mrp_price) return 0;
    return Math.round((1 - serviceData.price / serviceData.mrp_price) * 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle description splitting safely
  const getDescriptionParts = () => {
    if (!serviceData?.description) return ['', ''];
    const parts = serviceData.description.split('Kit:');
    return [parts[0], parts[1] || ''];
  };

  const [descriptionPart, kitPart] = getDescriptionParts();

  // Image handling with fallback
  // const getImageUrl = (imagePath) => {
  //   if (!imagePath) return '/images/placeholder-product.jpg';
  //   return imagePath.startsWith('http') ? imagePath : `http://localhost:3000/${imagePath}`;
  // };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <style>{styles}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  // Show product not found state
  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/gifting')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Browse Gifts
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <>
   <MetaTags
  title="Gifting Categories | Plants, Customized Gifts, Hampers & Loved One Presents"
  description="Discover the best gifting categories including indoor Plants, Customized Gifts, Luxury Hampers, and thoughtful presents for your Loved Ones. Perfect gifts for every occasion in Kanpur."
  keywords="Gift Plants, Customized Gifts Kanpur, Gift Hampers, Personalized Presents, Gifts for Loved Ones, Kanpur Gift Shop"
/>
      <ToastContainer autoClose={3000} />
      <style>{styles}</style>

      <div className="bg-gradient-to-b bg-amber-50 font-poppins pb-6 min-h-screen">
        {serviceData.isOffer && (
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Special Celebration Offer! Get {calculateDiscount()}% off on this product</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            {/* Product Images Section */}
            <div className="w-full md:w-1/2 mb-8 px-4">
              <div className="flex flex-col-reverse sm:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex flex-row sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] scrollbar-hide">
                  {[serviceData.featured_image, ...serviceData.other_images].map((src, index) => (
                    <div
                      key={index}
                      className={`relative size-16 sm:size-20 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-300 border-2 ${mainImage === src ? 'thumbnail-active' : 'border-amber-100'}`}
                      onClick={() => changeImage(src)}
                    >
                      <img
                        // src={getImageUrl(src)}
                        src={`${API}${src}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="relative flex-1">
                  <img
                    src={`${API}${mainImage}`}
                    alt={serviceData.name}
                    className="w-full h-auto max-h-[500px] object-contain rounded-xl product-shadow border-2 border-amber-100"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  {serviceData.isOffer && (
                    <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {serviceData.status === 'new' ? 'NEW!' : 'OFFER!'}
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden sm:hidden md:block mt-6">
                <DescriptionOverview description={descriptionPart} />
                {serviceData.isOffer && (
                  <div className="mb-6 p-4 bg-white rounded-xl border-2 border-amber-100 shadow-sm mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-amber-500" size={18} />
                      <h3 className="font-semibold text-amber-800">Celebration Special!</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      {serviceData.status === 'active'
                        ? "Free gift wrapping and personalized message included with every order this season! 🎁"
                        : "Special limited-time offer for this product!"}
                    </p>
                  </div>
                )}
                <CompactReviewSlider product_id={serviceData.product_id}></CompactReviewSlider>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold mb-1 font-playfair text-amber-800">
                {serviceData.name}
              </h2>

              {/* Pricing Section */}
              <div className="mb-1 flex items-center">
                <span className="text-2xl font-bold text-amber-700 mr-2">
                  {formatPrice(serviceData.price)}
                </span>

                <>
                  <span className="text-gray-500 line-through">
                    {formatPrice(serviceData.mrp_price)}
                  </span>
                  <span className="ml-3 bg-amber-100 text-amber-800 text-sm font-medium px-2 py-1 rounded-full">
                    Save {calculateDiscount()}% ✨
                  </span>
                </>

              </div>

              {/* Rating Section */}
              <CompactRating product_id={serviceData.product_id}></CompactRating>
              {/* Short Description */}
              <p className="text-gray-700 mb-1 border-l-4 border-amber-300 pl-4 py-1 bg-amber-50 rounded-r-lg text-sm">
                {serviceData.short_description || serviceData.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  Quantity <span className="text-amber-500">✧</span>
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 border-2 border-amber-300 rounded-l-lg bg-gradient-to-b from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-1 disabled:opacity-50 transition-all duration-200"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className="text-amber-700" />
                  </button>

                  <div className="px-4 py-2 border-t-2 border-b-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white text-center w-14 font-medium text-amber-800">
                    {quantity}
                  </div>

                  <button
                    onClick={increaseQuantity}
                    className="p-2 border-2 border-amber-300 rounded-r-lg bg-gradient-to-b from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-1 disabled:opacity-50 transition-all duration-200"
                    disabled={quantity >= 99}
                  >
                    <Plus size={16} className="text-amber-700" />
                  </button>
                </div>

                {/* Decorative elements */}

              </div>

              {/* Pincode Checker */}
              <PincodeDeliveryChecker
                onDeliveryAvailable={setIsDeliveryAvailable}
                pincode={pincode}
                setPincode={setPincode}
              />

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleBookNow}
                  disabled={!isDeliveryAvailable || isProcessing}
                  className={`bg-gradient-to-r from-amber-500 to-amber-600 flex gap-2 items-center justify-center text-white px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all transform shadow-lg min-w-[150px] ${!isDeliveryAvailable || isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:from-amber-600 hover:to-amber-700 hover:scale-[1.02] hover:shadow-xl'
                    }`}
                >
                  {isProcessing ? (
                    <LoadingSpinner size={20} color="white" />
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      {cartStatus.isInCart ? 'Update Cart' : 'Add to Cart'}
                    </>
                  )}
                </button>

                <GiftWishlistButton productId={serviceData.product_id}></GiftWishlistButton>
              </div>

              {/* Product Description - Mobile */}
              <div className="block md:hidden mt-6">
                <DescriptionOverview description={descriptionPart} />
              </div>
              <KitsOverview data={kitPart} />

              <div className="block md:hidden mt-2">
                <CompactReviewSlider product_id={serviceData.product_id}></CompactReviewSlider>


              </div>

              {/* Delivery Information */}
              <div className="space-y-4 mt-6">
                <DeliveryInfo />
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <h2 className="text-3xl font-bold text-center google-font mt-12 mb-6">
            <span className="border-b-[1vw] border-amber-700 rounded-md inline-block">
              Related Products
            </span>
          </h2>
          <div className="space-y-6">
            <RelatedProductSection2 />
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftsDetailsPage;