import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingsService from '../services/settingsService';
import toast from 'react-hot-toast';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    },
  });
};
