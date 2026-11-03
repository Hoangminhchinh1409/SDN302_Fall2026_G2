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

          // Sync cart after login
          try {
            const useCartStore = (await import('./useCartStore')).default;
            await useCartStore.getState().syncCartWithBackend();
          } catch (syncErr) {
            console.error('Cart sync error upon login:', syncErr);
          }
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

          // Sync cart after register
          try {
            const useCartStore = (await import('./useCartStore')).default;
            await useCartStore.getState().syncCartWithBackend();
          } catch (syncErr) {
            console.error('Cart sync error upon register:', syncErr);
          }
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
          set({ user: null });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
