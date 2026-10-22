import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/users/login', { email, password });
          set({ user: data, isLoading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed',
            isLoading: false 
          });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/users', { name, email, password });
          set({ user: data, isLoading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false 
          });
        }
      },

      logout: async () => {
        try {
          await api.post('/users/logout');
          set({ user: null });
        } catch (error) {
          console.error('Logout error', error);
          set({ user: null }); // logout locally anyway
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
