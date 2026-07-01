import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Autoplay, Pagination } from 'swiper/modules';
import { EyeIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, removeEvent } from '../../redux/eventManagementSlice';
import StarRating from '../ratings/StarRating';
import { API } from "../../utils/api";

const CardTypeC = ({
  title = "Featured Services",
  description = "Explore our wide range of services",
  services = [],
  baseImageUrl = "",
  serviceLinkPrefix = "/event-management",
  themeColor = "#ff7e00",
  showRating = true,
  showPrice = true,
  ctaText = "Book Now",
  section,
  sectionSlug
}) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);


    const dispatch = useDispatch();
    const { events, loading, error } = useSelector((state) => state.events);


    useEffect(() => {
      dispatch(fetchEvents());
    }, [dispatch]);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 text-xs" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-xs" />
        ))}
      </>
    );
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  console.log("Bhai KHrab ho gya =>", services)

  return (
    <section className="bg-amber-50 md:px-0  px-2 lg:px-0 rashi_wrapper mt-2" id="zodiac_Sign">
      <div className="container-fluid  md:px-6 px-3 lg:px-6">
        <div className="heading_wrapper mb-6">
          <div className="my-12 mb-4">
            <div className="text-[rgb(94,15,77)]">
              <div className="flex flex-wrap justify-between items-center gap-2"> {/* Added flex-wrap and gap */}
                <h2 className="text-inherit text-2xl sm:text-3xl font-bold min-w-[50%] flex-1"> {/* Added min-width */}
                  {section}
                </h2>

                {sectionSlug && (
                  <Link
                    to={title.toLowerCase()}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-800 cursor-pointer text-sm sm:text-base font-medium whitespace-nowrap"
                  >
                    <span>View All</span>
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={30}
          slidesPerView={4}

          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {services?.map((service, index) => {
            const words = service.name.split(" ");
            return (
              <SwiperSlide key={index}>
                <Link
                  to={`${sectionSlug}/${service.slug_url}`}
                  className="block h-full"
                  state={{ serviceData: service, sectionData: section }}
                >
                  <motion.div
                    className="h-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                    style={{ borderBottom: `3px solid ${themeColor}` }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Fixed Image Section (unchanged) */}
                    <div className="w-full h-48 md:h-56 overflow-hidden flex-shrink-0">
                      <img
                        src={
                               service.featured_image
                                 ? `${API}${service.featured_image}`
                                 : service.image
                             }
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Fixed Content Section */}
                  <div className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-auto min-h-[220px] sm:min-h-[220px] w-full">
  {/* Category badge */}
  <div className="mb-2 flex items-center">
    <span
      className="inline-block px-3 py-1 text-xs font-medium rounded-full  max-w-[95%]"
      style={{
        backgroundColor: `${themeColor}20`,
        color: themeColor,
      }}
    >
      {service.category_name || "Uncategorized"}
    </span>
  </div>

  {/* Title */}
  <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug">
    {service.name}
  </h4>

  {/* Price */}
  {showPrice && (
    <div className="flex items-center mb-2 text-xs sm:text-sm flex-wrap">
      <span className="font-medium text-gray-700">Starting at</span>
      <span
        className="font-bold ml-1"
        style={{ color: themeColor }}
      >
        {formatPrice(service.price)}
      </span>
    </div>
  )}

  {/* Button pushed to bottom */}
  <div className="mt-auto">
    <motion.button
      className="w-full py-2 px-4 rounded-lg uppercase font-medium text-xs sm:text-sm tracking-wide text-white transition-colors duration-300 flex items-center justify-center"
      style={{ backgroundColor: themeColor }}
      whileHover={{
        backgroundColor: "#e67300",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {ctaText}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 sm:h-4 sm:w-4 ml-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </motion.button>
  </div>
</div>

                  </motion.div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

    </section>
  );
};

export default CardTypeC;