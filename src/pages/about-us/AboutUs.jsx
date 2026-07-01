import { motion } from 'framer-motion';
import { FaGift, FaGlassCheers, FaBirthdayCake, FaCar, FaHeart, FaLeaf } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import vinay from '../../assets/team/WhatsApp Image 2025-09-21 at 12.13.05 AM.webp'
import aryan from "/src/assets/team/WhatsApp Image 2025-09-21 at 12.09.32 AM.webp";
import img1 from '../../assets/banner/mobile/nbsj0uhbbklm8ubngjdr.webp'

const AboutUs = () => {
  const services = [
    { icon: <FaGift className="text-xl text-yellow-500" />, title: "Luxury Gifting", description: "Exquisite gift boxes" },
    { icon: <FaGlassCheers className="text-xl text-yellow-500" />, title: "Wedding Decor", description: "Magical transformations" },
    { icon: <FaBirthdayCake className="text-xl text-yellow-500" />, title: "Birthday Themes", description: "Creative decorations" },
    { icon: <FaCar className="text-xl text-yellow-500" />, title: "Anniversary Decor", description: "Memorable setups" },
    { icon: <FaHeart className="text-xl text-yellow-500" />, title: "Romantic Events", description: "Dreamy proposals" },
    { icon: <FaLeaf className="text-xl text-yellow-500" />, title: "Corporate Events", description: "Elegant gatherings" }
  ];

  const team = [
    { name: "Aryan", role: "Founder", image: aryan },
    { name: "Shobhit Shukla", role: "Event Manager", image: "https://randomus.me/api/portraits/women/44.jpg" },
    { name: "Shivanshu Batham", role: "Decor Specialist", image: "https://randomus.me/api/portraits/men/75.jpg" },
    { name: "Vinay", role: "Gift Curator", image: vinay }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Event background" 
          className="absolute w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">About A4Celebration</h1>
          <p className="text-yellow-300">Creating moments through decorations and gifting</p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold mb-2 inline-block border-b-2 border-yellow-500 pb-1">Our Story</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Founded in 2025 as a small decor studio, now a premier event design company.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <img 
              src={img1} 
              alt="Corporate Event" 
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">From Humble Beginnings</h3>
            <p className="text-gray-600">
              Started with one wedding, now handling hundreds annually. Commitment to creativity and quality.
            </p>
            <p className="text-gray-600">
              Expanded to include e-commerce gifting platform across India.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">30+ Events</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">3+ Cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-12 bg-gray-100 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold mb-2 inline-block border-b-2 border-yellow-500 pb-1">Our Services</h2>
            <p className="text-gray-600">Celebration solutions for special moments</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3">{service.icon}</div>
                <h3 className="text-center font-medium mb-1">{service.title}</h3>
                <p className="text-center text-sm text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold mb-2 inline-block border-b-2 border-yellow-500 pb-1">Our Team</h2>
          <p className="text-gray-600">Dedicated to extraordinary celebrations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((member, index) => (
          
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {console.log(member.image.aryan)}
              <div className="aspect-square overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-yellow-600">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-yellow-600 text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-3">Ready to Elevate Your Celebration?</h2>
          <p className="mb-6">Contact us to discuss your event vision.</p>
          <Link to="/contact"

            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-black rounded font-medium shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;