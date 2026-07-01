import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Autoplay, Pagination } from 'swiper/modules';
import { EyeIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRatingsForProduct } from '../../redux/ratingSlice';
import StarRating from '../ratings/StarRating';
import { API } from "../../utils/api";

const CardTypeA = ({
  services = [],
  baseImageUrl,
  themeColor = "#ff7e00",
  showRating = true,
  showPrice = true,
  ctaText = "Book Now",
  section,
  sectionSlug,
  title
}) => {


  console.log("exact images ===>", services)



 

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
  return (
    <section className="bg-amber-50 md:px-0 sm:px-4 px-4 lg:px-0 rashi_wrapper mt-2" id="zodiac_Sign">
      <div className="container-fluid mx-auto md:px-6 sm:px-0 px-0 lg:px-6">
        <div className="heading_wrapper mb-6">
          <div className="my-12 mb-4">
            <div>
              <div className="text-[rgb(94,15,77)]">
                <div className="flex justify-between items-center">
                  <h2 className="text-inherit text-2xl sm:text-3xl font-bold">
                    {section}
                  </h2>

                  {sectionSlug && (
                    <Link
                      to={title.toLowerCase()}
                      className="flex items-center gap-2 text-amber-600 hover:text-amber-800 cursor-pointer text-sm sm:text-base font-medium"
                    >
                      <span>View All</span>
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 1000,
          }}
          spaceBetween={30}
          slidesPerView={4}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
        >
          {services?.map((service, index) => {
            const words = service.name.split(" ");
            return (

              <>
              <SwiperSlide key={index}>
                <Link
                  to={`${sectionSlug}/${service.slug_url}`}
                  className="block h-full"
                  state={{
                    serviceData: service,
                    sectionData: section
                  }}
                >
                  <div
                    className="rashi_sign_box bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 p-2 h-full flex flex-col"
                    style={{ borderRadius: "16px", border: `1px ${themeColor} solid` }}
                  >
                    {/* Image Section - Fixed Height */}
                    <div className="sign_box_img flex justify-center mb-2 h-40">
                      <img
                        src={`${API}${service.featured_image}`}
                        alt={service.name}
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>

                    {/* Content Section - Flex grow for consistent height */}
                    <div className="sign_box_cont text-center p-1 flex flex-col flex-grow">
                      <h3 className="text-md font-medium font-semibold mb-2 line-clamp-2 sm:min-h-[3rem] min-h-[3rem] md:min-h-auto flex items-center justify-center">
                        {words.length > 4 ? `${words.slice(0, 2).join(" ")}` : service.name}
                      </h3>

                      {showRating && (
                        <div className="flex justify-center items-center gap-1 text-xs mt-1">
                          <StarRating product_id={service.product_id} />


                          {/* //call a function for each product id  */}
                        
                        </div>
                      )}




                      {showPrice && (
                        <p className="mb-2 text-xs text-gray-600 ">
                          Price: <span className="text-gray-600 font-medium">{formatPrice(service.price)}</span>
                          <span className="ml-2 text-red-400 line-through font-light">
                            {formatPrice(service.mrp_price)}
                          </span>
                        </p>
                      )}

                      <div className="mt-auto">
                        <Link
                          to={`${sectionSlug}/${service.slug_url}`}
                          className="inline-block text-xs px-3 py-1.5 rounded-md uppercase text-white transition-colors duration-300"
                          style={{ backgroundColor: themeColor }}
                          state={{
                            serviceData: service,
                            sectionData: section
                          }}
                        >
                          {ctaText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>

              </>
            );
          })}
        </Swiper>
      </div>

    </section>
  );
};

export default CardTypeA;