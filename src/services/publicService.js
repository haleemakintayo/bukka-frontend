import apiClient from './apiClient';

export const publicService = {
  // --- Public Vendor Storefront ---
  getVendorBySlug: async (slug) => {
    const response = await apiClient.get(`/vendors/${slug}`);
    return response.data;
  },

  getVendorMenuBySlug: async (slug) => {
    const response = await apiClient.get(`/vendors/${slug}/menu`);
    return response.data;
  },

  getVendorDeliveryAreas: async (slug) => {
    const response = await apiClient.get(`/vendors/${slug}/delivery-areas`);
    return response.data;
  },

  getVendorQR: async (slug) => {
    const response = await apiClient.get(`/vendors/${slug}/qr`);
    return response.data;
  },

  // --- Vendor Self-Registration ---
  registerVendor: async (payload) => {
    const response = await apiClient.post('/vendors/register', payload);
    return response.data;
  },

  // --- Orders & Payments ---
  createOrder: async (payload) => {
    const response = await apiClient.post('/orders', payload);
    return response.data;
  },

  verifyOrderPayment: async (reference) => {
    const response = await apiClient.post('/orders/verify', { reference });
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  }
};