import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data.data;
        
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
        
        return response.data;
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          set({ 
            user: response.data.data, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'novapos-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
