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
  }
}));

export default useBrandStore;
