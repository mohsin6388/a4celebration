import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar, FaArrowRight } from "react-icons/fa";
import Lottie from "lottie-react";
import animationData from './Animation - 1751703073724.json';
import StarRating from '../ratings/StarRating';

const ArtistCardB = ({
  artists = [],
  baseImageUrl = "https://a4celebration.com/api/",
  themeColor = "#ff7e00",
  showRating = true,
  ctaText = "VIEW PROFILE",
  section,
  sectionSlug
}) => {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (artists.length === 0) {
    return (
      <section className="bg-white rashi_wrapper mt-2" id="featured-artists">
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="w-64 h-64">
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoplay={true}
            />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mt-4">
            No artists found
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            We couldn't find any artists matching your criteria
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rashi_wrapper mt-2" id="featured-artists">
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 auto-rows-fr">
          {artists.map((artist) => (
            <div key={artist._id} className="h-full">
              <Link
                to={`/artist-management/service/${artist.slug_url}`}
                className="block h-full"
                state={{ artistData: artist }}
              >
                <div
                  className="rashi_sign_box bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 p-2 h-full flex flex-col"
                  style={{
                    borderRadius: "16px",
                    border: `1px ${themeColor} solid`,
                    minHeight: '280px'
                  }}
                >
                  {/* Image Section */}
                  <div className="sign_box_img flex justify-center mb-2 h-40 relative">
                    <img
                      src={
                        artist.featured_image
                          ? `${baseImageUrl}${artist.featured_image.replace(/\\/g, '/')}`
                          : '/default-artist.jpg'
                      }
                      alt={artist.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                    
                    {/* Experience Badge */}
                    <div className="absolute bottom-1 right-1 bg-white/90 px-2 py-1 rounded-lg shadow-sm">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-xs" style={{ color: themeColor }}>
                          {artist.experience} yrs exp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="sign_box_cont text-center p-1 flex flex-col flex-grow">
                    <h4 className="text-sm font-medium mb-1 line-clamp-2">
                      {artist.name}
                    </h4>

                    <p className="text-xs text-gray-500 mb-1">
                      {artist.category_name}
                    </p>

                   

                    {/* Events */}
                    {artist.type_of_events?.length > 0 && (
                      <div className="mt-1 mb-2">
                        <p className="text-xs text-gray-500 mb-1">Events:</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {artist.type_of_events.slice(0, 2).map((event, i) => (
                            <span 
                              key={i} 
                              className="px-1 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs"
                            >
                              {event}
                            </span>
                          ))}
                          {artist.type_of_events.length > 2 && (
                            <span className="px-1 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                              +{artist.type_of_events.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex justify-center">
                      <Link
                        to={`/artist-management/service/${artist.slug_url}`}
                        state={{ artistData: artist }}
                        className="inline-block text-xs px-2 py-1.5 rounded-md uppercase text-white transition-colors duration-300 whitespace-nowrap"
                        style={{ backgroundColor: themeColor }}
                      >
                        {ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistCardB;