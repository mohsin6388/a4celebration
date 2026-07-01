import React from 'react';
import { motion } from 'framer-motion';
import img1 from '../../assets/banner/1860 400 BIRTHDAY (1).jpg'
import img2 from '../../assets/banner/mobile/mp95a1mdt8t4qlnagmxj.webp'
import { Link } from 'react-router-dom';

// Image sources
const desktopImg =img1;
const mobileImg =img2;

const Banner1 = () => {
  return (
    <div className="px-3">
      <div className="w-full rounded-3xl overflow-hidden shadow-lg">
        <Link to="/decorations/birthday-decoration">
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
            alt="Best birthday decorations for home and outdoor venues"
            className="w-full h-[45vw] sm:h-[22.8vw] object-fill rounded-3xl"
            loading="lazy"
          />
        </motion.picture>
        </Link>
      </div>
    </div>
  );
};

export default Banner1;
