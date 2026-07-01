import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import img1 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.43.05 PM (2).jpeg'
import img2 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.43.05 PM (1).jpeg'

import img3 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.43.05 PM.jpeg'
import img4 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.43.07 PM.jpeg'
import img5 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.51.32 PM.jpeg'
import img6 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.53.26 PM.jpeg'
import img7 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.54.33 PM.jpeg'
import img8 from '../../assets/reviews/WhatsApp Image 2025-09-09 at 3.55.20 PM.jpeg'

const reviews = [
  {
    name: "Akriti Yadav",
    review: "Absolutely loved the service! Highly recommended.Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 4.5,
    image: img1
  },
  {
    name: "Mohit",
    review: "Great experience. Very professional staff and everyone was so polite. Loved the experience, Overall i will highly recommend & Loved the experience, highly recommended",
    rating: 5,
    image: img2
  },
  {
    name: "Vaishnavi Sharma",
    review: "Service was good but can improve on punctuality.Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 4,
    image: img3
  },
  {
    name: "Anukalp",
    review: "Fantastic customer care. Will come back again!Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 4,
    image: img6
  },
  {
    name: "Sameer Verma",
    review: "Everything went smoothly, great service.Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 4.5,
    image: img7
  },
  {
    name: "Sandeep",
    review: "Very satisfied with the professionalism.Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/6.jpg"
  },
  {
    name: "Rohini Katiyar",
    review: "Good support and easy process.Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 4,
    image: img5
  },
  {
    name: "Aryan Sharma",
    review: "Could improve the delivery time.Loved the experience, highly recommendedLoved the experience, highly recommended",
    rating: 4,
    image: img8
  },
  {
    name: "Jia Rehman",
    review: "Loved the experience, highly recommendedLoved the experience, highly recommendedLoved the experience, highly recommended!",
    rating: 4.5,
    image: img4
  }
];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <>
      {[...Array(full)].map((_, i) => <FaStar key={`f-${i}`} className="text-yellow-400 text-xs" />)}
      {half && <FaStarHalfAlt className="text-yellow-400 text-xs" />}
      {[...Array(empty)].map((_, i) => <FaRegStar key={`e-${i}`} className="text-yellow-400 text-xs" />)}
    </>
  );
};

const CustomerReviewSlider = () => {
  return (
    <section className="px-2 py-6 bg-amber-50 mt-8 ">
      <h2
        className="text-center text-4xl sm:text-5xl font-bold tracking-wide mb-8 text-amber-600"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        Customer Reviews
      </h2>


      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        spaceBetween={10}

        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {reviews.map((review, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white border border-amber-300 shadow-md shadow-amber-200 rounded-lg p-3 flex flex-col items-center text-center h-full pb-8">
              <img
                src={review.image}
                alt={review.name}
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
              <h3 className="font-medium text-sm mb-1">{review.name}</h3>
              <div className="flex justify-center mb-1">{renderStars(review.rating)}</div>
              <p className="text-gray-600 text-xs">{review.review}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CustomerReviewSlider;
