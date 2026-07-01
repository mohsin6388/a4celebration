import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaStar, FaStarHalfAlt, FaRegStar, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { EyeIcon } from "lucide-react";

const ArtistCardB = ({
  title = "Featured Artists",
  description = "Explore our talented artists",
  artists = [],
  baseImageUrl = "https://a4celebration.com/api/",
  themeColor = "#ff7e00",
  showRating = true,
  ctaText = "VIEW PROFILE",
  section,
  sectionSlug
}) => {


  {console.log(section)}
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <section className=" pt-8 pb-4" id="featured-artists">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
           <div className="text-[rgb(94,15,77)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold ">
              {title}
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

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={30}
          slidesPerView={4}
         
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {artists.map((artist) => (
            <SwiperSlide key={artist._id}>
              <div className="h-full px-2 pb-1">
                <Link
                  to={`/artist-management/service/${artist.slug_url}`}
                  className="block h-full"
                  state={{ artistData: artist }}
                >
                  <div className="h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          artist.featured_image
                            ? `${baseImageUrl}${artist.featured_image.replace(/\\/g, '/')}`
                            : '/default-artist.jpg'
                        }
                        alt={artist.name}
                        
                        className="w-full h-full object-cover"
                      />
                    
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Experience Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-lg shadow-sm">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold" style={{ color: themeColor }}>
                            {artist.experience} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                        {artist.name}
                      </h3>

                      <p className="text-sm text-gray-500 mb-2">
                        {artist.category_name}
                      </p>

                      {showRating && renderStars(4.5)}

                      {/* Events */}
                      {artist.type_of_events?.length > 0 && (
                        <div className="mt-2 mb-3">
                          <p className="text-xs text-gray-500 mb-1">Events:</p>
                          <div className="flex flex-wrap gap-1">
                            {artist.type_of_events.slice(0, 3).map((event, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                              >
                                {event}
                              </span>
                            ))}
                            {artist.type_of_events.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                +{artist.type_of_events.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
                        style={{ backgroundColor: themeColor }}
                      >
                        <span>{ctaText}</span>
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ArtistCardB;