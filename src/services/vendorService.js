import apiClient from './apiClient';

export const vendorService = {
  login: async (payload) => {
    // payload should be { phone_number, pin } or { telegram_chat_id, pin }
    const response = await apiClient.post('/auth/vendor/login', payload);
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/vendors/me/dashboard');
    return response.data;
  },

  getOrders: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/vendors/me/orders', { params: { skip, limit } });
    return response.data;
  },

  getMenu: async () => {
    const response = await apiClient.get('/vendors/me/menu');
    return response.data;
  },

  updateMenuItem: async (itemId, data) => {
    const response = await apiClient.patch(`/vendors/me/menu/${itemId}`, data);
    return response.data;
  }
};
