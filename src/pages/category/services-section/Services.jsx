import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

import lottie from "../../../assets/lottie/what-to-do.json";

const Services = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10 text-center">
      {/* Lottie Animation */}
      <Lottie
        animationData={lottie}
        loop
        autoplay
        className="w-48 sm:w-56 md:w-72 lg:w-80 mb-6"
      />

      {/* Text Guidance */}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
        Our Services Page is Coming Soon 💄✨
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mb-6">
        Exciting services are on the way! From{" "}
        <span className="font-semibold">Makeup</span> &{" "}
        <span className="font-semibold">Mehndi {" "}</span>  
        to <span className="font-semibold">Photography</span> and{" "}
        <span className="font-semibold">Décor</span>,  
        we’re preparing everything to make your events unforgettable.
      </p>

      {/* Back Button */}
      <Link
        to="/"
        className="px-5 py-2 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm sm:text-base md:text-lg rounded-xl shadow-md transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
};

export default Services;
