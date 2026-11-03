import { create } from 'zustand';
import api from '../api/axios';

const useCouponStore = create((set, get) => ({
  coupons: [],
  loading: false,
  error: null,

  fetchCoupons: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/coupons');
      set({ coupons: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  createCoupon: async (couponData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/coupons', couponData);
      set({
        coupons: [data, ...get().coupons],
        loading: false,
      });
      return { success: true, coupon: data };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create coupon';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  deleteCoupon: async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      set({ coupons: get().coupons.filter((c) => c._id !== id) });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete' };
    }
  },
}));

export default useCouponStore;
