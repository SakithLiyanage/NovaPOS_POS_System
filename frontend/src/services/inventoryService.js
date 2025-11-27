import api from './api';

const inventoryService = {
  adjustStock: async (data) => {
    const response = await api.post('/inventory/adjust', data);
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  getHistory: async (params = {}) => {
    const response = await api.get('/inventory/history', { params });
    return response.data;
  },
};

export default inventoryService;
