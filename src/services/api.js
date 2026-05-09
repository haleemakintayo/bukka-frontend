/**
 * api.js — Shared API utilities and configured axios instance.
 *
 * All admin-specific calls live in adminService.js.
 * All public/storefront calls live in publicService.js.
 * This file only exports shared helpers and the raw axios client for edge cases.
 */
import axios from 'axios';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://bukka-ai-backend-523632194f78.herokuapp.com'
).replace(/\/+$/, '');

const API_PREFIX = '/api/v1';

// ─── URL Helpers ─────────────────────────────────────────────────────────────

export const buildApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const resolveAssetUrl = (path) => (path ? buildApiUrl(path) : '');

// ─── Error Message Extractor ──────────────────────────────────────────────────

export const getApiErrorMessage = (
  error,
  fallbackMessage = 'Something went wrong while contacting the server.'
) => {
  const detail = error?.response?.data?.detail;
  const errors = error?.response?.data?.errors;

  if (Array.isArray(detail))
    return detail.map((item) => item?.msg || item).filter(Boolean).join(', ');
  if (Array.isArray(errors))
    return errors.map((e) => e?.msg || e).filter(Boolean).join(', ');
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (
    typeof error?.response?.data?.message === 'string' &&
    error.response.data.message.trim()
  )
    return error.response.data.message;
  if (
    typeof error?.message === 'string' &&
    error.message.trim() &&
    error.message !== 'Network Error'
  )
    return error.message;
  return fallbackMessage;
};

// ─── Raw Axios Instance (use apiClient.js for admin routes with auto-refresh) ─

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export { API_PREFIX };
export default api;
