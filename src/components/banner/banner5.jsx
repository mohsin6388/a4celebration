import React from 'react';
import { motion } from 'framer-motion';
import img4 from '../../assets/banner/2 Artiest Management.webp'
import { Link } from 'react-router-dom';
import img2 from '../../assets/banner/mobile/leiwlk8gwlpneeisblew.webp'
// Image sources for Banner3
const desktopImg = img4;
const mobileImg = img2;

const Banner5 = () => {
  return (
    <div className="px-3 mt-6">
      <Link className="w-full rounded-3xl overflow-hidden shadow-lg" to="/artist-management">
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
            alt="Proposal Banner"
            className="w-full h-[45vw] sm:h-[22.8vw] object-fill rounded-3xl"
            loading="lazy"
          />
        </motion.picture>
      </Link>
    </div>
  );
};

export default Banner5;
