import { create } from 'zustand';
import api from '../api/axios';

const useServiceStore = create((set) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/services');
      set({ services: data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createService: async (serviceData) => {
    try {
      const { data } = await api.post('/services', serviceData);
      set((state) => ({ services: [...state.services, data] }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const { data } = await api.put(`/services/${id}`, serviceData);
      set((state) => ({
        services: state.services.map((s) => (s._id === id ? data : s))
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteService: async (id) => {
    try {
      await api.delete(`/services/${id}`);
      set((state) => ({ services: state.services.filter((s) => s._id !== id) }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
}));

export default useServiceStore;
