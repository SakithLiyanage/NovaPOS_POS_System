import api from './api';

const reportService = {
  getSummary: async (params = {}) => {
    const response = await api.get('/reports/summary', { params });
    return response.data;
  },

  getSalesByDate: async (params = {}) => {
    const response = await api.get('/reports/sales-by-date', { params });
    return response.data;
  },

  getTopProducts: async (params = {}) => {
    const response = await api.get('/reports/top-products', { params });
    return response.data;
  },

  getSalesByCategory: async (params = {}) => {
    const response = await api.get('/reports/sales-by-category', { params });
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },
};

export default reportService;
