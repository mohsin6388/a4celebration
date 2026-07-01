import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
// Replace with your actual base URL

export const applyCoupon = async (code) => {
  try {
    const response = await axios.post(`${API_URL}apply/coupon`, { code }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
         'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error applying coupon:', error);
    return {
      valid: false,
      message: error.response?.data?.message || 'Invalid coupon',
    };
  }
};

export const getCoupon = async (code) => {
  try {
    const response = await axios.get(`${API_URL}get/allcoupons`,{
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return 'Error fetching coupons'
  }
};
