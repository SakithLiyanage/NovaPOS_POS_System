import api from './api';

const salesService = {
  getAll: async (params = {}) => {
    const response = await api.get('/sales', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  create: async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  getReceipt: async (id) => {
    const response = await api.get(`/sales/${id}/receipt`);
    return response.data;
  },
};

export default salesService;
