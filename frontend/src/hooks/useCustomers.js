import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerService from '../services/customerService';
import toast from 'react-hot-toast';

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getAll(params),
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer created');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer updated');
    },
  });
};
