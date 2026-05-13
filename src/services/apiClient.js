import axios from 'axios';
import { API_BASE_URL } from './api';

const baseURL = `${API_BASE_URL}/api/v1`;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add the Bearer token to admin routes
apiClient.interceptors.request.use((config) => {
  const adminToken = sessionStorage.getItem('admin_access_token');
  const vendorToken = localStorage.getItem('vendor_access_token'); // use localStorage for PWA persistence
  
  if (adminToken && config.url.includes('/admin') && !config.url.includes('/login')) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (vendorToken && config.url.includes('/vendors/me') && !config.url.includes('/login')) {
    config.headers.Authorization = `Bearer ${vendorToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Logic to prevent multiple refresh calls if multiple requests fail simultaneously
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor to handle 401s and token refreshes
apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return apiClient(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    // Detect if this is an admin or vendor request
    const isAdmin = originalRequest.url.includes('/admin');
    
    if (isAdmin) {
      const refreshToken = sessionStorage.getItem('admin_refresh_token');
      if (!refreshToken) {
        sessionStorage.clear();
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${baseURL}/admin/refresh`, { refresh_token: refreshToken });
        sessionStorage.setItem('admin_access_token', data.access_token);
        sessionStorage.setItem('admin_refresh_token', data.refresh_token);
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        sessionStorage.clear();
        window.location.href = '/admin/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Vendor refresh logic (could be similar if endpoint exists, else just logout)
      processQueue(error, null);
      localStorage.removeItem('vendor_access_token');
      window.location.href = '/vendor/login';
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
});

export default apiClient;