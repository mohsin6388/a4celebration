import React from "react";
import footer from '../../assets/A4 Celebration 1 (3).png'
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaInstagram, FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
       <footer className="bg-black text-white">
  {/* Top Footer Section */}
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      
      {/* Brand Column */}
      <div className="space-y-6">
        <img 
          className="h-32 object-contain" 
          src={footer}
          alt="A4Celebration Logo" 
        />
        <p className="text-gray-300">
          A4Celebration – Trusted Event Planner in Kanpur for 
          <strong> Decorations, Giftings, Catering, Artist Management, and Complete Event Solutions</strong>.
        </p>
      </div>

      {/* Decoration Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Decorations</h5>
        <ul className="space-y-2 pl-0">
          <li><Link to="/decorations/baby-shower" className="text-gray-300 hover:text-amber-400 transition">Decoration for Baby Shower</Link></li>
          <li><Link to="/decorations/birthday" className="text-gray-300 hover:text-amber-400 transition">Decoration for Birthday</Link></li>
          <li><Link to="/decorations/baby-welcome" className="text-gray-300 hover:text-amber-400 transition">Decoration for Baby Welcome</Link></li>
          <li><Link to="/decorations/bachelorette" className="text-gray-300 hover:text-amber-400 transition">Decoration for Bachelorette</Link></li>
          <li><Link to="/decorations/pre-wedding" className="text-gray-300 hover:text-amber-400 transition">Decoration for Pre Wedding</Link></li>
          <li><Link to="/decorations/wedding" className="text-gray-300 hover:text-amber-400 transition">Decoration for Wedding</Link></li>
          <li><Link to="/decorations/first-night" className="text-gray-300 hover:text-amber-400 transition">Decoration for First Night</Link></li>
          <li><Link to="/decorations/car" className="text-gray-300 hover:text-amber-400 transition">Decoration for Car</Link></li>
          <li><Link to="/decorations/anniversary" className="text-gray-300 hover:text-amber-400 transition">Decoration for Anniversary</Link></li>
        </ul>
      </div>

      {/* Gifting Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Giftings</h5>
        <ul className="space-y-2 pl-0">
          <li><Link to="/giftings/plants" className="text-gray-300 hover:text-amber-400 transition">Gifting for Plants</Link></li>
          <li><Link to="/giftings/customized" className="text-gray-300 hover:text-amber-400 transition">Gifting for Customized Items</Link></li>
          <li><Link to="/giftings/hampers" className="text-gray-300 hover:text-amber-400 transition">Gifting for Hampers</Link></li>
          <li><Link to="/giftings/loved-one" className="text-gray-300 hover:text-amber-400 transition">Gifting for Loved Ones</Link></li>
          <li><Link to="/giftings/kids" className="text-gray-300 hover:text-amber-400 transition">Gifting for Kids</Link></li>
        </ul>
      </div>

      {/* Artist Management Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Artist Management</h5>
        <ul className="space-y-2 pl-0">
          <li><Link to="/artist-management/singers" className="text-gray-300 hover:text-amber-400 transition">Artist Management for Singers & Bands</Link></li>
          <li><Link to="/artist-management/djs" className="text-gray-300 hover:text-amber-400 transition">Artist Management for DJs</Link></li>
          <li><Link to="/artist-management/anchors" className="text-gray-300 hover:text-amber-400 transition">Artist Management for Anchors & Hosts</Link></li>
          <li><Link to="/artist-management/celebrities" className="text-gray-300 hover:text-amber-400 transition">Artist Management for Celebrities</Link></li>
          <li><Link to="/artist-management/dancers" className="text-gray-300 hover:text-amber-400 transition">Artist Management for Dancers</Link></li>
        </ul>
      </div>

      {/* Event Management Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Event Management</h5>
        <ul className="space-y-2 pl-0">
          <li><Link to="/event-management/destination-wedding" className="text-gray-300 hover:text-amber-400 transition">Event Management for Destination Weddings</Link></li>
          <li><Link to="/event-management/marriage-event" className="text-gray-300 hover:text-amber-400 transition">Event Management for Marriages</Link></li>
          <li><Link to="/event-management/corporate-event" className="text-gray-300 hover:text-amber-400 transition">Event Management for Corporate Events</Link></li>
       
        </ul>
      </div>
    </div>
    
    {/* Quick Links and Contact Section - Now properly arranged in a row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-800">
      {/* Quick Links Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Quick Links</h5>
        <ul className="space-y-2">
          <li><Link to="/about" className="text-gray-300 hover:text-amber-400 transition">About Us</Link></li>
          {/* <li><Link to="/gallery" className="text-gray-300 hover:text-amber-400 transition">Gallery</Link></li> */}
          {/* <li><Link to="/services" className="text-gray-300 hover:text-amber-400 transition">Our Services</Link></li> */}
          <li><Link to="/help" className="text-gray-300 hover:text-amber-400 transition">FAQ</Link></li>
          <li><Link to="/contact" className="text-gray-300 hover:text-amber-400 transition">Contact Us</Link></li>
        </ul>
      </div>

      {/* Contact Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Contact Us</h5>
        <ul className="space-y-3">
          <li className="flex items-start">
            <FaMapMarkerAlt className="mt-1 mr-3 text-amber-500 flex-shrink-0" />
            <a
              href="https://www.google.com/maps/place/195,+Awadhpuri+Rd,+near+ICICI+Bank,+Lakhanpur,+Khyora,+Kanpur,+Uttar+Pradesh+208024"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-amber-400 transition cursor-pointer"
            >
              195, Awadhpuri Rd, near ICICI Bank, Lakhanpur, Khyora, Kanpur, Uttar Pradesh 208024
            </a>
          </li>
          <li className="flex items-center">
            <FaPhone className="mr-3 text-amber-500" />
            <a
              href="tel:+918750200899"
              className="text-gray-300 hover:text-amber-400 transition cursor-pointer"
            >
              +91 8750200899
            </a>
          </li>
          <li className="flex items-center">
            <FaEnvelope className="mr-3 text-amber-500" />
            <a
              href="mailto:hello@deificdigital.com"
              className="text-gray-300 hover:text-amber-400 transition cursor-pointer"
            >
              hello@deificdigital.com
            </a>
          </li>
          <li className="flex items-center">
            <FaClock className="mr-3 text-amber-500" />
            <span className="text-gray-300">Mon-Sat: 10AM–7PM</span>
          </li>
        </ul>
      </div>
      
      {/* Follow Us Column */}
      <div>
        <h5 className="text-lg font-medium mb-4 text-amber-500">Follow Us</h5>
        <p className="text-gray-300 mb-4">Stay connected with us on social media for updates and inspiration.</p>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/a4celebration/" className="p-2 bg-gray-800 text-white rounded-full hover:bg-amber-600 transition">
            <FaInstagram className="text-xl" />
          </a>
          <a
            href="https://wa.me/918750200899"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-amber-600 transition"
          >
            <FaWhatsapp className="text-xl" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61562203856563" className="p-2 bg-gray-800 text-white rounded-full hover:bg-amber-600 transition">
            <FaFacebook className="text-xl" />
          </a>
          <a href="#" className="p-2 bg-gray-800 text-white rounded-full hover:bg-amber-600 transition">
            <FaTwitter className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  </div>

  {/* SEO Line */}
  

  {/* Divider */}
  <div className="border-t border-gray-800"></div>

  {/* Bottom Footer Section */}
  <div className="container mx-auto px-4 py-6 mb-10 md:mb-0">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="text-gray-400 text-sm mb-4 md:mb-0">
        &copy; {new Date().getFullYear()} A4Celebration. Best Event Management, Decorations, Giftings & Catering in Kanpur.
        Powered by{" "}
        <a
          href="https://deificdigital.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white underline cursor-pointer"
        >
          Deific Digital
        </a>
      </div>

      <div className="flex flex-wrap justify-center space-x-4">
        <Link to="/privacy" className="text-gray-300 hover:text-amber-400 text-sm transition">Privacy Policy</Link>
        <Link to="/terms" className="text-gray-300 hover:text-amber-400 text-sm transition">Terms of Service</Link>
        <Link to="/refunds" className="text-gray-300 hover:text-amber-400 text-sm transition">Refund Policy</Link>
      </div>
    </div>
  </div>
</footer>
    );
}

export default Footer;