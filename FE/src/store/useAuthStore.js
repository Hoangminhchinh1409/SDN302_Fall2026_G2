import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import safePersistStorage from './safePersistStorage';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get('/users/profile');
          set({ user: data, isLoading: false });
          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Không thể tải hồ sơ người dùng';
          set({ error: message, isLoading: false });
          return null;
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.put('/users/profile', profileData);
          set({ user: data, isLoading: false });
          return { success: true, user: data };
        } catch (error) {
          const message = error.response?.data?.message || 'Không thể cập nhật hồ sơ người dùng';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

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
    { name: 'auth-storage', storage: safePersistStorage }
  )
);

export default useAuthStore;
