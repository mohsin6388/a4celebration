import React from 'react';
import { motion } from 'framer-motion';
import bannerImage from '../../assets/banner/Gift.jpg'
import { Link } from 'react-router-dom';
import img2 from '../../assets/banner/mobile/tdvblrkhavq3k5jrv6u0.webp'
// Image sources for Banner2
const desktopImg = bannerImage;
const mobileImg = img2;

const Banner2 = () => {
  return (
    <div className="px-3 mt-6">
      <div className="w-full rounded-3xl overflow-hidden shadow-lg">
        <Link to="/giftings">

        <motion.picture
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="block w-full"
        >
          {/* Desktop Source */}
          <source media="(min-width: 769px)" srcSet={desktopImg} />
          {/* Mobile Source */}
          <source media="(max-width: 768px)" srcSet={mobileImg} />
          {/* Fallback image */}
          <img
            src={desktopImg}
            alt="Unique Gifts & Surprises for all occasions"
            className="w-full h-[45vw] sm:h-[22.8vw] object-fill rounded-3xl"
            loading="lazy"
          />
        </motion.picture>
        </Link>
      </div>
    </div>
  );
};

export default Banner2;
