import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: () => api.get('/reports/summary').then(res => res.data),
  });
};

export const useSalesByDate = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'sales-by-date', params],
    queryFn: () => api.get('/reports/sales-by-date', { params }).then(res => res.data),
  });
};

export const useTopProducts = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'top-products', params],
    queryFn: () => api.get('/reports/top-products', { params }).then(res => res.data),
  });
};

export const useLowStock = () => {
  return useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => api.get('/inventory/low-stock').then(res => res.data),
  });
};
