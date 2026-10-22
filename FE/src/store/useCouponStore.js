import { create } from 'zustand';
import api from '../api/axios';

const useCouponStore = create((set) => ({
  coupons: [],
  loading: false,
  error: null,

  fetchCoupons: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/coupons');
      set({ coupons: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  }
}));

export default useCouponStore;
