import React from 'react';
import { motion } from 'framer-motion';
import img1 from '../../assets/banner/Sa Re Ga Ma Pa.webp'
import img2 from '../../assets/banner/mobile/nbsj0uhbbklm8ubngjdr.webp'

// Image sources for Banner3
const desktopImg = img1;
const mobileImg = img2;

const Banner3 = () => {
  return (
    <div className="px-3 mt-6">
      <div className="w-full rounded-3xl overflow-hidden shadow-lg">
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
      </div>
    </div>
  );
};

export default Banner3;
