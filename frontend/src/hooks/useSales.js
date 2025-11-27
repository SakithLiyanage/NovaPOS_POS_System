import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useSales = (params = {}) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => api.get('/sales', { params }).then(res => res.data),
  });
};

export const useSale = (id) => {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => api.get(`/sales/${id}`).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/sales', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['dashboard']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create sale'),
  });
};
