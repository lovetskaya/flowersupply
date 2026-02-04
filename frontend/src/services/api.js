import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Поставщики
export const supplierApi = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplier) => api.post('/suppliers', supplier),
  update: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// Инвентарь
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  add: (item) => api.post('/inventory', item),
  updateQuantity: (id, quantity) => 
    api.put(`/inventory/${id}/quantity`, { quantity }),
  delete: (id) => api.delete(`/inventory/${id}`),
  getStats: () => api.get('/inventory/stats'),
};

// Заказы
export const orderApi = {
  getAll: () => api.get('/orders'),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  create: (order) => api.post('/orders', order),
  updateStatus: (id, status) => 
    api.put(`/orders/${id}/status`, { status }),
  getBySupplier: (supplierId) => api.get(`/orders/supplier/${supplierId}`),
};

// Продажи
export const saleApi = {
  getAll: () => api.get('/sales'),
  getRecent: (limit) => api.get(`/sales/recent?limit=${limit}`),
  create: (sale) => api.post('/sales', sale),
  getRevenue: (startDate, endDate) => 
    api.get(`/sales/revenue?startDate=${startDate}&endDate=${endDate}`),
  getTopSelling: () => api.get('/sales/top-selling'),
  getByDateRange: (startDate, endDate) => 
    api.get(`/sales/date-range?startDate=${startDate}&endDate=${endDate}`),
};

// Статистика
export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard'),
  getInventoryStats: () => api.get('/inventory/stats'),
};

export default api;