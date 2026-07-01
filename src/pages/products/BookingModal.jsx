import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from '../../utils/api';

const BookingModal = ({ artist, onClose, onSuccess, onError }) => {
  const token = import.meta.env.VITE_API_KEY;
  const [formData, setFormData] = useState({
    artistName: artist.name,
    occasion: '',
    concert: '',
    eventLocation: '',
    eventDate: '',
    budget: '',
    attendees: '',
    clientName: '',
    email: '',
    mobile: '',
    requirement: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }

    if (!formData.mobile.match(/^\d{1,10}$/)) {
      newErrors.mobile = 'Mobile must be 1-10 digits';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = 'Location is required';
    }

    if (!formData.attendees || formData.attendees < 1) {
      newErrors.attendees = 'Number of attendees must be greater than 0';
    }

    if (!formData.occasion) {
      newErrors.occasion = 'Occasion type is required';
    }

    if (!formData.concert.trim()) {
      newErrors.concert = 'Concert type is required';
    }

    if (!formData.budget) {
      newErrors.budget = 'Budget range is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    // if not logged in → stop
    if (!isLoggedIn || !userId) {
      toast.error("You must be logged in to submit this form!");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}api/api/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          userId, // send userId as well
        }),
      });

      if (response.ok) {
        toast.success("Booking request submitted successfully!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 3000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message);
      onError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b bg-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Book {artist.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.clientName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mobile *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Event Date *</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.eventDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.eventDate && <p className="text-xs text-red-500 mt-1">{errors.eventDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Event Location *</label>
              <input
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.eventLocation ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.eventLocation && <p className="text-xs text-red-500 mt-1">{errors.eventLocation}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Number of Attendees *</label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.attendees ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.attendees && <p className="text-xs text-red-500 mt-1">{errors.attendees}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Occasion Type *</label>
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.occasion ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Occasion</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Concert">Concert</option>
                <option value="Festival">Festival</option>
                <option value="Private Party">Private Party</option>
                <option value="Other">Other</option>
              </select>
              {errors.occasion && <p className="text-xs text-red-500 mt-1">{errors.occasion}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Concert Type *</label>
              <input
                type="text"
                name="concert"
                value={formData.concert}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.concert ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.concert && <p className="text-xs text-red-500 mt-1">{errors.concert}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Budget Range *</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Budget</option>
                <option value="₹10L-₹20L">₹10L-₹20L</option>
                <option value="₹20L-₹30L">₹20L-₹30L</option>
                <option value="₹30L-₹50L">₹30L-₹50L</option>
                <option value="₹50L+">₹50L+</option>
              </select>
              {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Special Requirements</label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          theme="light"
        />
      </div>
    </div>
  );
};

export default BookingModal;