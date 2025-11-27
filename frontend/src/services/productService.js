import api from './api';

const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },
};

export default productService;
