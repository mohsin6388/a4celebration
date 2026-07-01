import React from 'react';
import { motion } from 'framer-motion';
import './CategoryTopBanner.css';
import img1 from '../../../assets/Artist Management (1).jpg';

const desktopImg = img1;
const mobileImg = img1;

export default function CategoryTopBanner() {
  return (
    <div className="mt-3">
      <div className="w-full rounded-3xl overflow-hidden shadow-lg">

        {/* Motion + Responsive Picture */}
        <motion.picture
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="block w-full"
        >
          {/* Desktop */}
          <source media="(min-width: 769px)" srcSet={desktopImg} />
          {/* Mobile */}
          <source media="(max-width: 768px)" srcSet={mobileImg} />
          {/* Fallback */}
          <img
            src={desktopImg}
            alt="Celebration Banner"
            className="w-full h-[45vw] sm:h-[22.8vw] object-fill rounded-3xl"
            loading="lazy"
          />
        </motion.picture>

        {/* Gradient Overlay */}
       
      </div>
    </div>
  );
}
