import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { createRating, getAllRatingsForProduct, getAllUsers } from "../../services/rating-api-service/rating-api-service";
import { toast, ToastContainer } from "react-toastify";

const CompactReviewSlider = ({ product_id }) => {
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    isWishlisted: false,
    product_id: product_id,
    user_id: localStorage.getItem('userId')
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingsResponse, usersResponse] = await Promise.all([
          getAllRatingsForProduct(product_id),
          getAllUsers()
        ]);
        
        setRatings(ratingsResponse?.data || []);
        setUsers(usersResponse?.data || []);
        
        if (ratingsResponse?.data?.length > 0) {
          const avg = ratingsResponse.data.reduce((acc, curr) => acc + curr.rating, 0) / ratingsResponse.data.length;
          setAverageRating(avg);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [product_id]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5 text-xs">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <FaStar key={i} className="text-amber-500" />;
          } else if (i === fullStars && hasHalfStar) {
            return <FaStarHalfAlt key={i} className="text-amber-500" />;
          } else {
            return <FaRegStar key={i} className="text-amber-500" />;
          }
        })}
      </div>
    );
  };

  const getUserName = (user_id) => {
    const user = users.find(user => user._id === user_id);
    return user?.username || "Anonymous";
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  if (!userId) {
    toast.warning("Please login first to submit a review!");
    return;
  }

  try {
    const response = await createRating(formData);
    if (response?.status === 1) {
      toast.success("Review submitted!");
      setShowForm(false);
      setFormData({
        rating: 0,
        comment: "",
        isWishlisted: false,
        product_id: product_id,
        user_id: userId
      });
    } else {
      toast.error("Failed to submit review.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
};


  return (
    <div className="max-w-4xl mx-auto px-2 py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-black">Customer Reviews</h2>
          <div className="flex items-center mt-1">
            {renderStars(averageRating)}
            <span className="ml-2 text-xs text-gray-600">
              ({ratings.length} {ratings.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-2 sm:mt-0 px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-4 bg-white p-3 rounded border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold mb-2 text-black">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block text-xs text-gray-700 mb-1">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className="text-lg mr-0.5 focus:outline-none"
                  >
                    {formData.rating >= star ? (
                      <FaStar className="text-amber-500" />
                    ) : (
                      <FaRegStar className="text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-2">
              <label htmlFor="comment" className="block text-xs text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                rows="2"
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Reviews Slider */}
      {ratings.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          loop={ratings.length > 3}
          className="my-4"
        >
          {ratings.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="bg-white p-3 rounded border border-gray-200 h-full">
                <div className="flex items-start mb-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-medium mr-2">
                    {getUserName(item.user_id).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-black">{getUserName(item.user_id)}</p>
                    {renderStars(item.rating)}
                  </div>
                </div>
                <p className="text-xs text-gray-700 line-clamp-3">{item.comment}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.isWishlisted && (
                    <span className="flex items-center ml-2 text-amber-600">
                      <FaHeart className="mr-0.5" />
                      Saved
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded text-xs">
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
};

export default CompactReviewSlider;