import axios from 'axios';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://bukka-ai-backend-523632194f78.herokuapp.com'
).replace(/\/+$/, '');

const API_PREFIX = '/api/v1';
const ADMIN_TOKEN_KEY = 'admin_token';

export const buildApiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const resolveAssetUrl = (path) => (path ? buildApiUrl(path) : '');

export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong while contacting the server.') => {
  const detail = error?.response?.data?.detail;
  const errors = error?.response?.data?.errors;

  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg || item).filter(Boolean).join(', ');
  }
  if (Array.isArray(errors)) {
    return errors.map((e) => e?.msg || e).filter(Boolean).join(', ');
  }
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }
  if (typeof error?.response?.data?.message === 'string' && error.response.data.message.trim()) {
    return error.response.data.message;
  }
  if (typeof error?.message === 'string' && error.message.trim() && error.message !== 'Network Error') {
    return error.message;
  }
  return fallbackMessage;
};

const normalizePhoneNumber = (value = '') => String(value).replace(/\D/g, '');

const normalizeMenuItems = (items = []) =>
  items
    .filter((item) => item?.name && item?.price !== '' && item?.price !== null && item?.price !== undefined)
    .map((item) => ({
      name: item.name.trim(),
      price: Number(item.price),
      category: item.category?.trim() || 'General',
    }));

const normalizeVendorDirectoryItem = (vendor) => ({
  ...vendor,
  menu_count: vendor?.menu_count ?? vendor?.active_menu_items_count ?? 0,
  status: vendor?.status ?? (vendor?.is_active === false ? 'Inactive' : 'Active'),
});

const buildBankDetails = (vendorData = {}) => {
  if (typeof vendorData.bank_details === 'string' && vendorData.bank_details.trim()) {
    return vendorData.bank_details.trim();
  }

  const bankName = vendorData.bankName || vendorData.bank_name || '';
  const accountNumber = vendorData.accountNumber || vendorData.account_number || '';

  return [bankName, accountNumber].filter(Boolean).join(' ').trim();
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available (sessionStorage for better XSS resistance)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || '';

    if (error.response?.status === 401 && requestUrl.includes('/admin/')) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC VENDOR ENDPOINTS
// ============================================

/**
 * Get vendor details by slug
 * @param {string} slug - Vendor slug (e.g., "iya-basira-kitchen")
 */
export const getVendorBySlug = async (slug) => {
  const response = await api.get(`${API_PREFIX}/vendors/${slug}`);
  return response.data;
};

/**
 * Get vendor menu by slug
 * @param {string} slug - Vendor slug
 */
export const getVendorMenu = async (slug) => {
  const response = await api.get(`${API_PREFIX}/vendors/${slug}/menu`);
  return response.data;
};

/**
 * Get vendor QR code
 * @param {string} slug - Vendor slug
 */
export const getVendorQR = async (slug) => {
  const response = await api.get(`${API_PREFIX}/vendors/${slug}/qr`);
  return response.data;
};

// ============================================
// ORDER ENDPOINTS
// ============================================

/**
 * Create a new order
 * @param {object} orderData - Order details
 */
export const createOrder = async (orderData) => {
  const payload = {
    vendor_slug: orderData.vendor_slug ?? orderData.vendorSlug,
    items: (orderData.items || []).map((item) => ({
      menu_item_id: Number(item.menu_item_id ?? item.id),
      quantity: Number(item.quantity ?? 1),
      unit_price: Number(item.unit_price ?? item.price ?? 0),
    })),
    delivery_address: orderData.delivery_address ?? orderData.deliveryAddress,
  };

  const notes = orderData.notes?.trim();
  if (notes) {
    payload.notes = notes;
  }

  const response = await api.post(`${API_PREFIX}/orders`, payload);
  return response.data;
};

/**
 * Verify payment with backend
 * @param {object} verificationData - Payment reference and details
 */
export const verifyPayment = async (verificationData) => {
  const payload =
    typeof verificationData === 'string'
      ? { reference: verificationData }
      : { reference: verificationData.reference };

  const response = await api.post(`${API_PREFIX}/orders/verify`, payload);
  return response.data;
};

/**
 * Get order details
 * @param {string} orderId - Order ID
 */
export const getOrder = async (orderId) => {
  const response = await api.get(`${API_PREFIX}/orders/${orderId}`);
  return response.data;
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Admin login
 * @param {object} credentials - username and password
 */
export const adminLogin = async (credentials) => {
  const payload = {
    username: credentials.username?.trim(),
    password: credentials.password,
  };
  const response = await api.post(`${API_PREFIX}/admin/login`, payload);
  return response.data;
};

/**
 * Get all vendors (admin)
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Max records to return
 */
export const getAdminVendors = async (skip = 0, limit = 100) => {
  const response = await api.get(`${API_PREFIX}/admin/vendors`, {
    params: { skip, limit },
  });

  const vendors = Array.isArray(response.data)
    ? response.data
    : response.data?.vendors || [];

  return vendors.map(normalizeVendorDirectoryItem);
};

/**
 * Get single vendor (admin)
 * @param {string} vendorId - Vendor ID
 */
export const getAdminVendor = async (vendorId) => {
  const response = await api.get(`${API_PREFIX}/admin/vendors/${vendorId}`);
  return response.data;
};

/**
 * Update vendor (admin)
 * @param {string} vendorId - Vendor ID
 * @param {object} updateData - Fields to update
 */
export const updateAdminVendor = async (vendorId, updateData) => {
  const response = await api.patch(`${API_PREFIX}/admin/vendors/${vendorId}`, updateData);
  return response.data;
};

/**
 * Delete vendor (admin)
 * @param {string} vendorId - Vendor ID
 */
export const deleteAdminVendor = async (vendorId) => {
  const response = await api.delete(`${API_PREFIX}/admin/vendors/${vendorId}`);
  return response.data;
};

/**
 * Onboard new vendor
 * @param {object} vendorData - Vendor information
 */
export const onboardVendor = async (vendorData) => {
  const payload = {
    business_name: vendorData.business_name?.trim(),
    owner_name: vendorData.owner_name?.trim(),
    whatsapp_number: normalizePhoneNumber(vendorData.whatsapp_number),
    bank_details: buildBankDetails(vendorData),
    menu_items: normalizeMenuItems(vendorData.menu_items),
  };

  const response = await api.post(`${API_PREFIX}/admin/vendors/onboard`, payload);
  return response.data;
};

export default api;
