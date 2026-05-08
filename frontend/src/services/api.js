import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expertService = {
  getExperts: async () => {
    const response = await api.get('/experts');
    return response.data;
  },
  getExpertById: async (id) => {
    const response = await api.get(`/experts/${id}`);
    return response.data;
  }
};

export const bookingService = {
  getBookedSlotsForExpert: async (expertId) => {
    const response = await api.get(`/bookings/expert/${expertId}`);
    return response.data;
  },
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getBookingsByEmail: async (email) => {
    const response = await api.get(`/bookings?email=${email}`);
    return response.data;
  }
};

export default api;
