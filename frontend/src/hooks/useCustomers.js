import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => api.get('/customers', { params }).then((res) => res.data),
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => api.get(`/customers/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/customers', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer created');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create customer'),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/customers/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update customer'),
  });
};
