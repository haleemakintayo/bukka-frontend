import apiClient from './apiClient';

export const vendorService = {
  login: async (payload) => {
    // payload should be { phone_number, pin } or { telegram_chat_id, pin }
    const response = await apiClient.post('/auth/vendor/login', payload);
    return response.data;
  },

  /** GET /vendors/resolve-bank — verify Nigerian bank account */
  resolveBank: async (accountNumber, bankCode) => {
    const response = await apiClient.get('/vendors/resolve-bank', {
      params: { account_number: accountNumber, bank_code: bankCode },
    });
    return response.data;
  },

  /** POST /vendors/register — public self-onboarding */
  selfRegister: async (payload) => {
    const response = await apiClient.post('/vendors/register', payload);
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/vendors/me/dashboard');
    return response.data;
  },

  /** GET /vendors/me/settlement/today — live tally of verified Bachs transactions awaiting EOD transfer */
  getTodaySettlement: async () => {
    const response = await apiClient.get('/vendors/me/settlement/today');
    return response.data;
  },

  /** GET /vendors/me/settings — notification phone number, operating hours, global container cost */
  getStoreSettings: async () => {
    const response = await apiClient.get('/vendors/me/settings');
    return response.data;
  },

  /** PATCH /vendors/me/settings — update notification phone number, operating hours, or global container cost */
  updateStoreSettings: async (payload) => {
    const response = await apiClient.patch('/vendors/me/settings', payload);
    return response.data;
  },

  // ── Order Management & Fulfillment Endpoints ──────────────────────────────

  /**
   * GET /vendors/me/orders/summary — 5s polling summary
   * Returns { new_unaccepted_count, active_total_count, ready_count, latest_order_id, server_timestamp }
   */
  getOrdersSummary: async () => {
    const response = await apiClient.get('/vendors/me/orders/summary');
    return response.data;
  },

  /**
   * GET /vendors/me/orders/board — Kanban view
   * Returns { new_paid: [], preparing: [], ready_for_pickup: [], out_for_delivery: [], counts: {} }
   */
  getOrdersBoard: async () => {
    const response = await apiClient.get('/vendors/me/orders/board');
    return response.data;
  },

  /**
   * GET /vendors/me/orders — filtered list of orders
   * @param {Object} params - { tab, status, order_type, payment_status, search, start_date, end_date, page, limit, skip }
   */
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/vendors/me/orders', { params });
    return response.data;
  },

  /**
   * GET /vendors/me/orders/paginated — enveloped paginated list
   */
  getOrdersPaginated: async (params = {}) => {
    const response = await apiClient.get('/vendors/me/orders/paginated', { params });
    return response.data;
  },

  /** GET /vendors/me/orders/{orderId} — full detail for a single order */
  getOrderDetail: async (orderId) => {
    const response = await apiClient.get(`/vendors/me/orders/${orderId}`);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/accept — accept order & set kitchen prep time */
  acceptOrder: async (orderId, data = {}) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/accept`, data);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/ready — mark food ready for pickup or dispatch */
  markOrderReady: async (orderId, data = {}) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/ready`, data);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/dispatch — dispatch delivery order with rider info */
  dispatchOrder: async (orderId, data = {}) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/dispatch`, data);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/deliver — complete order & send thank-you */
  deliverOrder: async (orderId, data = {}) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/deliver`, data);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/reject — reject order, reverse stock, notify customer */
  rejectOrder: async (orderId, data = {}) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/reject`, data);
    return response.data;
  },

  /** POST /vendors/me/orders/{orderId}/cancel — cancel in-progress order & reverse stock */
  cancelOrder: async (orderId, data = {}) => {
    const response = await apiClient.post(`/vendors/me/orders/${orderId}/cancel`, data);
    return response.data;
  },

  /** POST /vendors/me/orders/batch — batch action on multiple orders */
  batchFulfillOrders: async (payload) => {
    // payload: { order_ids: number[], action: 'accept'|'ready'|'deliver', estimated_prep_minutes?: number }
    const response = await apiClient.post('/vendors/me/orders/batch', payload);
    return response.data;
  },

  // ── Menu Endpoints ────────────────────────────────────────────────────────

  getMenu: async () => {
    const response = await apiClient.get('/vendors/me/menu');
    return response.data;
  },

  /** GET /vendors/me/menu-v2 — dynamic menu V2 system */
  getMenuV2: async () => {
    const response = await apiClient.get('/vendors/me/menu-v2');
    return response.data;
  },

  /** POST /vendors/me/menu-v2 — add item (supports unit_type, stock_qty, reorder_level, is_compulsory) */
  addMenuV2Item: async (data) => {
    const response = await apiClient.post('/vendors/me/menu-v2', data);
    return response.data;
  },

  /** PATCH /vendors/me/menu-v2/{itemId} — update item details and flags */
  updateMenuV2Item: async (itemId, data) => {
    const response = await apiClient.patch(`/vendors/me/menu-v2/${itemId}`, data);
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

  // ── Campus Delivery Areas Endpoints ─────────────────────────────────────

  /** GET /vendors/me/delivery-areas — list all configured delivery zones */
  getDeliveryAreas: async () => {
    const response = await apiClient.get('/vendors/me/delivery-areas');
    return response.data;
  },

  /** POST /vendors/me/delivery-areas — add a new campus delivery zone */
  createDeliveryArea: async (payload) => {
    const response = await apiClient.post('/vendors/me/delivery-areas', payload);
    return response.data;
  },

  /** PATCH /vendors/me/delivery-areas/{areaId} — update zone price, name, or active toggle */
  updateDeliveryArea: async (areaId, payload) => {
    const response = await apiClient.patch(`/vendors/me/delivery-areas/${areaId}`, payload);
    return response.data;
  },

  /** DELETE /vendors/me/delivery-areas/{areaId} — delete a delivery zone */
  deleteDeliveryArea: async (areaId) => {
    const response = await apiClient.delete(`/vendors/me/delivery-areas/${areaId}`);
    return response.data;
  },

  /** POST /vendors/me/delivery-areas/batch — batch seed or update campus zones */
  batchCreateDeliveryAreas: async (areas) => {
    const response = await apiClient.post('/vendors/me/delivery-areas/batch', { areas });
    return response.data;
  },

  // ── Dispatch Fleet (Riders) Endpoints ───────────────────────────────────

  /** GET /vendors/me/riders — list all saved delivery riders */
  getRiders: async () => {
    const response = await apiClient.get('/vendors/me/riders');
    return response.data;
  },

  /** POST /vendors/me/riders — save a new rider to fleet */
  createRider: async (payload) => {
    const response = await apiClient.post('/vendors/me/riders', payload);
    return response.data;
  },

  /** PATCH /vendors/me/riders/{riderId} — update rider details or active toggle */
  updateRider: async (riderId, payload) => {
    const response = await apiClient.patch(`/vendors/me/riders/${riderId}`, payload);
    return response.data;
  },

  /** DELETE /vendors/me/riders/{riderId} — remove rider from fleet */
  deleteRider: async (riderId) => {
    const response = await apiClient.delete(`/vendors/me/riders/${riderId}`);
    return response.data;
  },
};

