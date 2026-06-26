/**
 * API Client
 * All calls to the channel manager backend go through here.
 * Automatically attaches JWT token and handles errors.
 */
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 (token expired) globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  login:  (email, password) => api.post('/auth/login',   { email, password }),
  logout: ()               => api.post('/auth/logout'),
};

// ── Inventory ─────────────────────────────────────
export const inventoryAPI = {
  getGrid:   (startDate, endDate, roomTypeId) =>
    api.get('/api/inventory', { params: { startDate, endDate, roomTypeId } }),
  update:    (data) => api.put('/api/inventory', data),
};

// ── Rates ─────────────────────────────────────────
export const ratesAPI = {
  update: (data) => api.put('/api/rates', data),
};

// ── Reservations ──────────────────────────────────
export const reservationsAPI = {
  list:         (params) => api.get('/api/reservations', { params }),
  create:       (data)   => api.post('/api/reservations', data),
  updateStatus: (id, status, notes) =>
    api.patch(`/api/reservations/${id}/status`, { status, notes }),
};

// ── Channels ──────────────────────────────────────
export const channelsAPI = {
  list:   ()            => api.get('/api/channels'),
  toggle: (id, active)  => api.patch(`/api/channels/${id}`, { isActive: active }),
};

// ── Room Types ────────────────────────────────────
export const roomTypesAPI = {
  list: () => api.get('/api/room-types'),
};

// ── Sync ──────────────────────────────────────────
export const syncAPI = {
  fullSync: (data)      => api.post('/api/sync/full', data),
  getLog:   (params)    => api.get('/api/sync/log', { params }),
  getStatus: ()         => api.get('/api/sync/status'),
};

// ── Dashboard ─────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
};

export default api;
