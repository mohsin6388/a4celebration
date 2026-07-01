// src/services/apiService.js
import axios from 'axios';
import AvailableCities from '../../components/service/AvailableCities';
import { API } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const getAllProducts = async () => {
  const selectedCity = localStorage.getItem('user_location');

  try {
    const response = await axios.get(`${API_URL}decoration/get-all-products`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const activeProducts = response.data.data.filter((product) => {
      if (!Array.isArray(product.available_cities)) {
        // If available_cities doesn't exist, only check status
        return product.status === 'active';
      } else {
        // If available_cities exists, check both status and selectedCity
        return (
          product.status === 'active' &&
          product.available_cities.includes(selectedCity)
        );
      }
    });

    return activeProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}decoration/create-product`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}decoration/update-product/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}decoration/get-productByID/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}decoration/delete-product/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// GET PRODUCT BY SLUG URL
export const getProductBySlug = async (slug) => {
  try {
    const response = await axios.get(
      // `https://a4celebration.com/api/api/decoration/get-product/${slug}`,
      `${API}api/decoration/get-product/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};
