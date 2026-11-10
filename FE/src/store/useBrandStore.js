import { create } from 'zustand';
import api from '../api/axios';

const useBrandStore = create((set) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/brands');
      set({ brands: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  createBrand: async (brandData) => {
    try {
      const { data } = await api.post('/brands', brandData);
      set((state) => ({ brands: [...state.brands, data] }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  updateBrand: async (id, brandData) => {
    try {
      const { data } = await api.put(`/brands/${id}`, brandData);
      set((state) => ({
        brands: state.brands.map((b) => (b._id === id ? data : b))
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteBrand: async (id) => {
    try {
      await api.delete(`/brands/${id}`);
      set((state) => ({ brands: state.brands.filter((b) => b._id !== id) }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
}));

export default useBrandStore;
