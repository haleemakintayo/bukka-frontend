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

  /** GET /vendors/me/orders/{orderId} — full detail for a single order */
  getOrderDetail: async (orderId) => {
    const response = await apiClient.get(`/vendors/me/orders/${orderId}`);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/ready — mark order as ready */
  markOrderReady: async (orderId) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/ready`);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/reject — reject order, reverse stock, notify customer */
  rejectOrder: async (orderId) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/reject`);
    return response.data;
  },

  getMenu: async () => {
    const response = await apiClient.get('/vendors/me/menu');
    return response.data;
  },

  /** PATCH /vendors/me/menu/{itemId} — update name, price, category, description, is_available */
  updateMenuItem: async (itemId, data) => {
    const response = await apiClient.patch(`/vendors/me/menu/${itemId}`, data);
    return response.data;
  },

  /** POST /vendors/me/menu — add a new menu item */
  addMenuItem: async (data) => {
    const response = await apiClient.post('/vendors/me/menu', data);
    return response.data;
  },

  /** DELETE /vendors/me/menu-v2/{itemId} — permanently remove a menu item (V2 only) */
  deleteMenuItem: async (itemId) => {
    await apiClient.delete(`/vendors/me/menu-v2/${itemId}`);
  },

  /** GET /vendors/me/analytics — vendor analytics */
  getAnalytics: async (days = 7) => {
    const response = await apiClient.get('/vendors/me/analytics', { params: { days } });
    return response.data;
  },

  // ── Availability endpoints ──────────────────────────────────────────────

  /** GET /vendors/me/availability — returns { is_open, pause_until, pause_remaining_seconds, status_label } */
  getAvailability: async () => {
    const response = await apiClient.get('/vendors/me/availability');
    return response.data;
  },

  /** POST /vendors/me/availability/open — opens the store, clears any pause */
  openStore: async () => {
    const response = await apiClient.post('/vendors/me/availability/open');
    return response.data;
  },

  /**
   * POST /vendors/me/availability/close
   * @param {boolean} force — if true, closes even with in-flight orders
   * Returns { status_label, ... } on 200
   * Returns 409 { detail: { message, in_flight_order_ids } } if in-flight orders exist and force=false
   */
  closeStore: async (force = false) => {
    const response = await apiClient.post('/vendors/me/availability/close', null, {
      params: force ? { force: true } : {},
    });
    return response.data;
  },

  /**
   * POST /vendors/me/availability/pause
   * @param {number} minutes — 5 to 480
   */
  pauseStore: async (minutes) => {
    const response = await apiClient.post('/vendors/me/availability/pause', { minutes });
    return response.data;
  },
};
