import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get('/products', { params }).then(res => res.data),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.get(`/products/${id}`).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/products', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create product'),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update product'),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete product'),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data),
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get('/brands').then(res => res.data),
  });
};
