import apiClient from './apiClient';

// ─── Normalisation helpers ────────────────────────────────────────────────────

const normalisePhone = (value = '') => String(value).replace(/\D/g, '');

const normaliseMenuItems = (items = []) =>
  items
    .filter(
      (item) =>
        item?.name &&
        item?.price !== '' &&
        item?.price !== null &&
        item?.price !== undefined
    )
    .map((item) => ({
      name: item.name.trim(),
      price: Number(item.price),
      category: item.category?.trim() || 'General',
    }));

const buildBankDetails = (data = {}) => {
  if (typeof data.bank_details === 'string' && data.bank_details.trim()) {
    return data.bank_details.trim();
  }
  const bank = data.bankName || data.bank_name || '';
  const account = data.accountNumber || data.account_number || '';
  return [bank, account].filter(Boolean).join(' ').trim();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const adminService = {
  /** POST /admin/login  — expects x-www-form-urlencoded */
  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    const response = await apiClient.post('/admin/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  /** POST /admin/refresh */
  refresh: async (refreshToken) => {
    const response = await apiClient.post('/admin/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /** POST /admin/register  — create a vendor-owner account */
  registerAdminUser: async ({ email, password, role = 'vendor_owner', vendor_id }) => {
    const response = await apiClient.post('/admin/register', {
      email,
      password,
      role,
      vendor_id,
    });
    return response.data;
  },

  // ─── Vendor Management ────────────────────────────────────────────────────

  /**
   * POST /admin/vendors/onboard
   * Creates vendor immediately (is_active=true), seeds menu, generates pairing + QR.
   */
  onboardVendor: async (vendorData) => {
    const payload = {
      business_name: vendorData.business_name?.trim(),
      owner_name: vendorData.owner_name?.trim(),
      slug: vendorData.slug?.trim() || undefined,
      whatsapp_number: normalisePhone(vendorData.whatsapp_number) || undefined,
      telegram_chat_id: vendorData.telegram_chat_id?.trim() || undefined,
      bank_details: buildBankDetails(vendorData),
      email: vendorData.email?.trim() || undefined,
      password: vendorData.password || undefined,
      menu_items: normaliseMenuItems(vendorData.menu_items),
    };
    // Remove undefined keys so backend doesn't receive nulls for optional fields
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );
    const response = await apiClient.post('/admin/vendors/onboard', payload);
    return response.data;
  },

  /**
   * GET /admin/vendors
   * @param {{ skip?: number, limit?: number, is_active?: boolean }} params
   */
  getVendors: async (params = {}) => {
    const response = await apiClient.get('/admin/vendors', { params });
    return response.data;
  },

  /** GET /admin/vendors/{id} */
  getVendorById: async (id) => {
    const response = await apiClient.get(`/admin/vendors/${id}`);
    return response.data;
  },

  /** PATCH /admin/vendors/{id} */
  updateVendor: async (id, payload) => {
    const response = await apiClient.patch(`/admin/vendors/${id}`, payload);
    return response.data;
  },

  /** PATCH /admin/vendors/{id}/activate */
  activateVendor: async (id, isActive) => {
    const response = await apiClient.patch(`/admin/vendors/${id}/activate`, {
      is_active: isActive,
    });
    return response.data;
  },

  /** POST /admin/vendors/{id}/regenerate-pairing */
  regeneratePairingCode: async (id) => {
    const response = await apiClient.post(
      `/admin/vendors/${id}/regenerate-pairing`
    );
    return response.data;
  },

  /** DELETE /admin/vendors/{id} */
  deleteVendor: async (id) => {
    const response = await apiClient.delete(`/admin/vendors/${id}`);
    return response.data;
  },

  // ─── Menu Management ──────────────────────────────────────────────────────

  /** GET /admin/vendors/{id}/menu */
  getVendorMenu: async (id) => {
    const response = await apiClient.get(`/admin/vendors/${id}/menu`);
    return response.data;
  },

  /** POST /admin/vendors/{id}/menu */
  addMenuItem: async (id, payload) => {
    const response = await apiClient.post(`/admin/vendors/${id}/menu`, payload);
    return response.data;
  },

  /** PATCH /admin/vendors/{id}/menu/{item_id} */
  updateMenuItem: async (id, itemId, payload) => {
    const response = await apiClient.patch(
      `/admin/vendors/${id}/menu/${itemId}`,
      payload
    );
    return response.data;
  },

  /** DELETE /admin/vendors/{id}/menu/{item_id} */
  deleteMenuItem: async (id, itemId) => {
    const response = await apiClient.delete(
      `/admin/vendors/${id}/menu/${itemId}`
    );
    return response.data;
  },
};