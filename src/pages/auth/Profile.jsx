import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../services/auth/auth";
import { logout } from "../../redux/userSlice";

import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserData } from "../../redux/userSlice";
import MyOrders from "./myOrder";
import MyCustomOrders from "./MyCustomOrders";
import { User, Mail, Phone, Shield, LogIn, Home, MapPin, Globe, Hash, Flag, Calendar, VenusAndMars } from 'lucide-react';
import MyCustomConfirmedOrders from "./MyCustomConfirmedOrders";
import MyArtistOrders from "./MyArtistOrders";
import { API } from "../../utils/api";
Modal.setAppElement('#root')


const EditProfileModal = ({ isOpen, onRequestClose, userData, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    landmark: "",
    gender: "",
    profile_image: "",
  });
    useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        pincode: userData.pincode || "",
        landmark: userData.landmark || "",
        gender: userData.gender || "",
        profile_image: userData.profile_image || "",
      });
    }
  }, [userData, isOpen]); // Also reset when modal opens

  const [inputWarnings, setInputWarnings] = useState({
    username: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    landmark: ""
  });

  // Define allowed patterns
  const allowedPatterns = {
    username: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    mobile: /^[0-9]{10,15}$/,
    pincode: /^[0-9]{4,10}$/
  };

  // Define blocked patterns (security)
  const blockedPatterns = {
    username: /[^a-zA-Z0-9_-]/g,
    email: /[<>"'`;|&{}[\]()]/g,
    mobile: /[^0-9]/g,
    address: /[<>"'`;|&{}[\]()]/g,
    city: /[<>"'`;|&{}[\]()]/g,
    country: /[<>"'`;|&{}[\]()]/g,
    pincode: /[^0-9]/g,
    landmark: /[<>"'`;|&{}[\]()]/g
  };

  // Enhanced validation logic
  const validateInput = (name, value) => {
    let warning = "";

    // First, check for blocked patterns
    if (blockedPatterns[name]?.test(value)) {
      warning = `Invalid character detected. Please remove special characters.`;
      setInputWarnings(prev => ({ ...prev, [name]: warning }));
      return false;
    }

    // Field-specific validation
    if (name === "username") {
      if (value.length > 30) {
        warning = "Username must be 30 characters or less";
      } else if (value.length < 3) {
        warning = "Username must be at least 3 characters";
      } else if (!allowedPatterns.username.test(value)) {
        warning = "Username can only contain letters, numbers, single underscores or hyphens";
      } else if (/_{2,}|-{2,}/.test(value)) {
        warning = "Username cannot have consecutive special characters";
      } else if (/^[_-]|[_-]$/.test(value)) {
        warning = "Username cannot start or end with special characters";
      }
    }

    if (name === "email") {
      if (!allowedPatterns.email.test(value)) {
        warning = "Please enter a valid email address";
      } else if (value.length > 254) {
        warning = "Email must be 254 characters or less";
      } else if (/(\.\.)|(@\.)|(\.@)/.test(value)) {
        warning = "Email contains invalid character sequence";
      } else if (/\.$/.test(value)) {
        warning = "Email cannot end with a dot";
      }
    }

    if (name === "mobile") {
      if (!allowedPatterns.mobile.test(value)) {
        warning = "Please enter a valid mobile number (10-15 digits)";
      }
    }

    if (name === "pincode") {
      if (value && !allowedPatterns.pincode.test(value)) {
        warning = "Please enter a valid pincode (4-10 digits)";
      }
    }

    setInputWarnings(prev => ({ ...prev, [name]: warning }));
    return warning === "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      // Sanitize input based on field type
      let sanitizedValue = value;

      if (name === "username") {
        sanitizedValue = value
          .replace(blockedPatterns.username, '')
          .replace(/_{2,}/g, '_')
          .replace(/-{2,}/g, '-')
          .replace(/^[_-]+/, '')
          .replace(/[_-]+$/, '')
          .substring(0, 30);
      }
      else if (name === "email") {
        sanitizedValue = value.replace(blockedPatterns.email, '');
      }
      else if (name === "mobile") {
        sanitizedValue = value.replace(blockedPatterns.mobile, '').substring(0, 15);
      }
      else if (name === "pincode") {
        sanitizedValue = value.replace(blockedPatterns.pincode, '').substring(0, 10);
      }
      else if (blockedPatterns[name]) {
        sanitizedValue = value.replace(blockedPatterns[name], '');
      }

      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      validateInput(name, sanitizedValue);
    }
  };

  const validateForm = () => {
    const validations = [
      validateInput("username", formData.username),
      validateInput("email", formData.email),
      formData.mobile ? validateInput("mobile", formData.mobile) : true,
      formData.pincode ? validateInput("pincode", formData.pincode) : true
    ];
    return validations.every(v => v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    const multipartFormData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        multipartFormData.append(key, formData[key]);
      }
    }

    try {
      const response = await updateUser(multipartFormData, userData._id);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onRequestClose();
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Profile update error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          overflow: 'hidden',
        },
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          right: 'auto',
          bottom: 'auto',
          border: 'none',
          background: '#fff',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }
      }}
      closeTimeoutMS={200}
    >
  
      <div className="relative">
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-center text-amber-600 mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Username", name: "username", type: "text", value: formData.username, required: true },
            { label: "Email", name: "email", type: "email", value: formData.email, required: true },
            { label: "Mobile", name: "mobile", type: "tel", value: formData.mobile, required: false },
            { label: "Gender", name: "gender", type: "select", value: formData.gender, required: false },
            { label: "Address", name: "address", type: "text", value: formData.address, required: false },
            { label: "City", name: "city", type: "text", value: formData.city, required: false },
            { label: "Country", name: "country", type: "text", value: formData.country, required: false },
            { label: "Pincode", name: "pincode", type: "text", value: formData.pincode, required: false },
            { label: "Landmark", name: "landmark", type: "text", value: formData.landmark, required: false },
          ].map((field, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-gray-600">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 border ${inputWarnings[field.name] ? "border-red-300 bg-red-50" : "border-gray-300"
                    } rounded-lg shadow-sm text-xs focus:outline-none focus:ring-2 focus:ring-amber-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <>
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 border ${inputWarnings[field.name] ? "border-red-300 bg-red-50" : "border-gray-300"
                      } rounded-lg shadow-sm text-xs focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    required={field.required}
                  />
                  {inputWarnings[field.name] && (
                    <div className="text-red-600 text-xs flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{inputWarnings[field.name]}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <div className="flex flex-col space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-gray-600">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleChange}
              accept="image/*"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4 sm:col-span-2">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-lg text-xs hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-500 focus:outline-none transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};






// Then define the Profile component
const Profile = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const user = userData?.data;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          await dispatch(fetchUserData(userId));
        } catch (err) {
          toast.error("Failed to load user data");
        }
      }
    };
    fetchData();
  }, [dispatch]);


  const navigate = useNavigate();

  function handleLogout() {
    toast.error("Logging out...", {
      position: "top-right",
      autoClose: 1000,

    });

    setTimeout(() => {
      localStorage.clear();
      dispatch(logout());
      navigate('/login');
    }, 1500);
  }



  // Refresh function that can be passed to EditProfileModal
  const refreshUserData = async (updatedData = null) => {
    try {
      const userId = localStorage.getItem('userId');
      if (updatedData) {
        // Update store with the freshly updated data
        dispatch({
          type: 'user/updateUserData',
          payload: updatedData
        });
      } else if (userId) {
        // Fallback to full refresh if no updatedData provided
        await dispatch(fetchUserData(userId));
      }
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error('Refresh error:', error);
    }
  };



  return (
    <section>
     <ToastContainer 
      position="top-right"
      autoClose={5000}
     
    />
      <div className="mx-auto mt-5 w-full space-y-4 px-4 text-sm xl:max-w-7xl my-2 ">
        <div>
          <h1 className="text-xl font-extrabold sm:text-3xl">My Account</h1>
        </div>
        <div className="space-y-3 rounded-lg border border-gray-400 bg-white pt-3 shadow py-4">
          <div className="flex flex-row justify-between px-4 pb-4 xl:pb-0">
            <div className="flex flex-auto space-x-1.5 sm:space-x-3">
              <div className="h-11 w-11 sm:h-20 sm:w-20">
                <img
                  className="border-primary-500 h-full w-full rounded-full border-2 p-[3px]"
                  src={
                    user?.profile_image
                      ? user?.social_type === "google"
                        ? user.profile_image
                        : `${API}api/${user.profile_image.replace(/\\/g, '/')}`
                      : "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369990.png"
                  }
                />

              </div>
              <div>
                <div className="flex flex-row items-center space-x-1 py-1">
                  <span className="text-sm font-extrabold sm:text-lg sm:font-bold">
                    {user?.username}
                  </span>
                  {user?.is_verified && <span><img src="assets/icons/verified.svg" alt="Verified" /></span>}
                </div>
                <div className="space-y-2 text-xs font-semibold text-gray-400">
                  <p>AccountID: #{user?._id?.toString().substring(0, 8).toUpperCase()}</p>
                  <div className="flex flex-col space-y-2 space-x-0 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-5">
                    <div>
                      <span><i className="fas fa-user"></i></span> {user?.role}
                    </div>
                    {user?.country && (
                      <div>
                        <span><i className="fas fa-map-marker-alt"></i></span> {user?.country}
                      </div>
                    )}
                    <div className="whitespace-nowrap">
                      <span><i className="far fa-envelope"></i></span> {user?.email}
                    </div>
                  </div>
                </div>
              </div>
              <div>

              </div>
            </div>
          </div>
          <div className=" w-full border-b border-gray-400 xl:block pb-2 p-6">
            <div id="accountTabs" className="flex flex-row flex-nowrap space-x-2 overflow-x-auto py-1">
  <button
    className={`px-2 py-1 rounded-lg border text-xs sm:text-sm transition-all duration-200 ${activeTab === 'overview'
      ? 'bg-black text-white border-black'
      : 'bg-white text-black border-gray-300'
    }`}
    onClick={() => setActiveTab('overview')}
  >
    Personal details
  </button>

  <button
    className={`px-2 py-1 rounded-lg text-xs sm:text-sm border transition-all duration-200 ${activeTab === 'accordion2'
      ? 'bg-black text-white border-black'
      : 'bg-white text-black border-gray-300'
    }`}
    onClick={() => setActiveTab('accordion2')}
  >
    My Orders
  </button>

  <button
    className={`px-2 py-1 rounded-lg text-xs sm:text-sm border transition-all duration-200 ${activeTab === 'accordion3'
      ? 'bg-black text-white border-black'
      : 'bg-white text-black border-gray-300'
    }`}
    onClick={() => setActiveTab('accordion3')}
  >
    My Custom Requests
  </button>
    <button
    className={`px-2 py-1 rounded-lg text-xs sm:text-sm border transition-all duration-200 ${activeTab === 'accordion4'
      ? 'bg-black text-white border-black'
      : 'bg-white text-black border-gray-300'
    }`}
    onClick={() => setActiveTab('accordion4')}
  >
    My Custom Orders
  </button>
   <button
    className={`px-2 py-1 rounded-lg text-xs sm:text-sm border transition-all duration-200 ${activeTab === 'accordion5'
      ? 'bg-black text-white border-black'
      : 'bg-white text-black border-gray-300'
    }`}
    onClick={() => setActiveTab('accordion5')}
  >
    My Artist Requests
  </button>
</div>
          </div>


          {activeTab === 'overview' && (
            <div className="animate-nk-acc-tab block space-y-12 px-4">
              <div id="accOverview" className="animate-nk-acc-tab block space-y-12 px-4">
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white py-4 shadow">
                  <div className="flex flex-auto items-center justify-between px-4">
                    <div className="text-base font-semibold sm:text-lg">Personal Details</div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-36 sm:w-48 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                      >
                        Edit Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-36 sm:w-48 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                      >
                        Logout
                      </button>
                    </div>

                  </div>
                  <div className="w-full border-b border-gray-400"></div>
                 <div className="px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Column 1 */}
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <User className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-gray-500">Username</div>
          <div className="font-medium text-gray-800">{user?.username}</div>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-gray-500">Email</div>
          <div className="font-medium text-gray-800 break-all">{user?.email}</div>
        </div>
      </div>
      
      {user?.mobile && (
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Mobile</div>
            <div className="font-medium text-gray-800">{user?.mobile}</div>
          </div>
        </div>
      )}
      
      {user?.gender && (
        <div className="flex items-start gap-3">
          <VenusAndMars className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Gender</div>
            <div className="font-medium text-gray-800 capitalize">{user?.gender}</div>
          </div>
        </div>
      )}
      
     
      
      {user?.social_type && (
        <div className="flex items-start gap-3">
          <LogIn className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Login Method</div>
            <div className="font-medium text-gray-800 capitalize">
              {user.social_type === 'other' ? 'Email/Password' : user.social_type}
            </div>
          </div>
        </div>
      )}
       <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-gray-500">Member Since</div>
          <div className="font-medium text-gray-800">
            {new Date(user?.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
    
    {/* Column 2 */}
    <div className="space-y-5">
      {user?.address && (
        <div className="flex items-start gap-3">
          <Home className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Address</div>
            <div className="font-medium text-gray-800">{user.address}</div>
          </div>
        </div>
      )}
      
      {user?.city && (
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">City</div>
            <div className="font-medium text-gray-800">{user.city}</div>
          </div>
        </div>
      )}
      
      {user?.country && (
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Country</div>
            <div className="font-medium text-gray-800">{user.country}</div>
          </div>
        </div>
      )}
      
      {user?.pincode && (
        <div className="flex items-start gap-3">
          <Hash className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Pincode</div>
            <div className="font-medium text-gray-800">{user.pincode}</div>
          </div>
        </div>
      )}
      
      {user?.landmark && (
        <div className="flex items-start gap-3">
          <Flag className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500">Landmark</div>
            <div className="font-medium text-gray-800">{user.landmark}</div>
          </div>
        </div>
      )}
      
     
       <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-xs text-gray-500">Account Status</div>
          <div className={`font-medium capitalize ${
            user?.status === 'active' ? 'text-green-600' : 'text-amber-600'
          }`}>
            {user?.status}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'accordion2' && (
            <div className="animate-nk-acc-tab block space-y-12 px-4">



              <div id="accOverview" className="animate-nk-acc-tab block space-y-12 px-4">
                <MyOrders userData={userData}></MyOrders>
              </div>
            </div>
          )}
          {activeTab === 'accordion3' && (
            <div className="animate-nk-acc-tab block space-y-12 px-4">



              <div id="accOverview" className="animate-nk-acc-tab block space-y-12 px-4">
                <MyCustomOrders></MyCustomOrders>
              </div>
            </div>
          )}


           {activeTab === 'accordion4' && (
            <div className="animate-nk-acc-tab block space-y-12 px-4">



              <div id="accOverview" className="animate-nk-acc-tab block space-y-12 px-4">
               <MyCustomConfirmedOrders userData={userData}></MyCustomConfirmedOrders>
              </div>
            </div>
          )}


           {activeTab === 'accordion5' && (
            <div className="animate-nk-acc-tab block space-y-12 px-4">



              <div id="accOverview" className="animate-nk-acc-tab block space-y-12 px-4">
               <MyArtistOrders userData={userData}></MyArtistOrders>
              </div>
            </div>
          )}
          
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        userData={user}
        onSuccess={refreshUserData}

      />

    </section>
  );
};

export default Profile;