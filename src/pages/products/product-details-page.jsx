import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronRight, Gift, Sparkles } from 'lucide-react';
import DeliveryInfo from '../../components/delivery/DeliveryInfo';
import PincodeDeliveryChecker from '../../components/delivery/Delivery-date';
import ProductOverview from '../../components/product/ProductOverview';
import RelatedProductSection1 from '../../components/related-products-feed/related-product-section-1';
import { useLocation } from 'react-router-dom';
import { API } from '../../utils/api';

// Add this in your main CSS file or at the top of your component
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
`;

const ProductDetailsPage = () => {





  const location = useLocation();
  const { serviceData, sectionData } = location.state;

  const [mainImage, setMainImage] = useState(
    `${API}api/${serviceData.featured_image}`
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  const changeImage = (src) => {
    setMainImage(`${API}api/${src}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bg-gradient-to-b bg-amber-50 font-poppins">
        {/* Special Offer Ribbon */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
          <Gift className="h-4 w-4" />
          <span>Special Celebration Offer! Get 15% off on all accessories</span>
          <ChevronRight className="h-4 w-4" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            {/* Product Images */}
            <div className="w-full md:w-1/2 mb-8 px-4">
              <div className="relative">
                <img
                  src={mainImage}
                  alt="Product"
                  className="w-full h-auto rounded-xl product-shadow border-2 border-amber-100 mb-4"
                  id="mainImage"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NEW!
                </div>
              </div>
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                {serviceData.other_images.map((src, index) => (
                  <div
                    key={index}
                    className={`relative size-16 sm:size-20 rounded-lg cursor-pointer transition-all duration-300 border-2 ${mainImage === src ? "border-amber-500 scale-105" : "border-amber-100"}`}
                    onClick={() => changeImage(src)}
                  >
                    <img
                      // src={"https://a4celebration.com/api/" + src}
                      src={`${API}api/${src}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    {mainImage === src && (
                      <div className="absolute inset-0 bg-amber-500 bg-opacity-20 rounded-md"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden sm:hidden md:block">
                <ProductOverview />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold mb-2 font-playfair text-amber-800">
                {serviceData.name}
              </h2>
              <p className="text-amber-600 mb-4">SKU: WH1000XM4</p>

              <div className="mb-4 flex items-center">
                <span className="text-3xl font-bold text-amber-700 mr-2">
                  $349.99
                </span>
                <span className="text-gray-500 line-through">$399.99</span>
                <span className="ml-3 bg-amber-100 text-amber-800 text-sm font-medium px-2 py-1 rounded-full">
                  Save 12% ✨
                </span>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`${index < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    size={20}
                  />
                ))}
                <span className="ml-2 text-gray-600">4.5 (120 reviews)</span>
              </div>

              <p className="text-gray-700 mb-6 border-l-4 border-amber-300 pl-4 py-2 bg-amber-50 rounded-r-lg">
                Experience premium sound quality and industry-leading noise
                cancellation with these wireless headphones. Perfect for music
                lovers and frequent travelers. 🎧✨
              </p>

              <div className="mb-6 p-4 bg-amber-50 rounded-xl border-2 border-amber-100">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-amber-800 mb-1"
                >
                  Quantity:
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    defaultValue="1"
                    className="w-16 text-center rounded-lg border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none py-2"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    Only 5 left in stock!
                  </span>
                </div>
              </div>

              <div className="flex space-x-4 mb-6">
                <button className="bg-gradient-to-r from-amber-500 to-amber-600 flex gap-2 items-center text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  className={`flex gap-2 items-center px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all border-2 ${isWishlisted ? "bg-amber-50 border-amber-500 text-amber-600" : "border-amber-200 text-gray-800 hover:border-amber-300"}`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    size={20}
                    className={
                      isWishlisted ? "fill-amber-600 text-amber-600" : ""
                    }
                  />
                  Wishlist
                </button>
              </div>

              <div className="mb-6 p-4 bg-white rounded-xl border-2 border-amber-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-amber-500" size={18} />
                  <h3 className="font-semibold text-amber-800">
                    Celebration Special!
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Free gift wrapping and personalized message included with
                  every order this season! 🎁
                </p>
              </div>

              <div className="space-y-4">
                <PincodeDeliveryChecker />
                <DeliveryInfo />
                <div className="block md:hidden">
                  <ProductOverview />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center google-font mt-8">
            <span className="border-b-[1vw] border-amber-700 rounded-md inline-block">
              Related Products
            </span>
          </h2>

          <div className="space-y-6">
            <RelatedProductSection1 />
            <RelatedProductSection1 />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;