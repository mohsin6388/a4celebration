import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, Heart, ShoppingCart, User, List } from "lucide-react";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa6";
import unknown from '../../assets/profile/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
import { API } from "../../utils/api";

const MobileBottomNavbar = () => {
  const { userData, isAuthenticated } = useSelector((state) => state.user);
  
  const sanitizePath = (path) => {
    if (!path) return "";
    return path.replace(/\\/g, '/').replace(/\/\/+/g, '/');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center py-2">
        {/* Home */}
        <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-amber-500">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* Search */}
        <Link to="/decorations" className="flex flex-col items-center text-gray-700 hover:text-amber-500">
          <List className="h-5 w-5" />
          <span className="text-xs mt-1">Categories</span>
        </Link>

        {/* Wishlist */}
        <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-amber-500">
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">Wishlist</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-amber-500">
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs mt-1">Cart</span>
        </Link>

        {/* Profile */}
        {isAuthenticated ? (
          <Link 
            to="/profile" 
            className="flex flex-col items-center text-gray-700 hover:text-amber-500"
          >
            <div
              style={{
                backgroundImage: `url(${userData?.data?.profile_image
                  ? userData.data.social_type === 'google'
                    ? (userData.data.profile_image)
                    : `${API}/api` + sanitizePath(userData.data.profile_image)
                  : unknown
                  })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
              }}
            />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        ) : (
          <Link 
            to="/login" 
            className="flex flex-col items-center text-gray-700 hover:text-amber-500"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNavbar;