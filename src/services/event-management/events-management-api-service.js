import axios from 'axios';
import { API } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}event/get-all-events`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const activeProducts = response.data.data.filter(
      (product) => product.status === 'active',
    );

    return activeProducts;
  } catch (error) {
    z;
    console.error('Error fetching wedding events:', error);
    throw error;
  }
};

/**
 * Create a new wedding event
 * @param {FormData} formData - Form data with wedding event details and images
 */
export const createEvent = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}event/create-event`,
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
    console.error('Error creating wedding event:', error);
    throw error;
  }
};

/**
 * Update an existing wedding event
 * @param {string} id - event ID
 * @param {FormData} formData - Updated data with optional images
 */
export const updateEvent = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}event/update-event/${id}`,
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
    console.error('Error updating wedding event:', error);
    throw error;
  }
};

/**
 * Get a wedding event by ID
 * @param {string} eventId - event ID
 */
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_URL}event/get-event-by-id/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching wedding event:', error);
    throw error;
  }
};

export const getEventByProductId = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}event/get-event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wedding event:', error);
    throw error;
  }
};

/**
 * Delete a wedding event
 * @param {string} id - event ID
 */
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}event/delete-event/${id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting wedding event:', error);
    throw error;
  }
};

export const getEventProductBySlug = async (slug) => {
  try {
    const response = await axios.get(
      // `https://a4celebration.com/api/api/event/get-event-by-slug/${slug}`,
       `${API}api/event/get-event-by-slug/${slug}`,
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
