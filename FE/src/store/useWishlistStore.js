import { create } from 'zustand';
import api from '../api/axios';

const useWishlistStore = create((set) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/users/wishlist');
      set({ wishlist: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      const { data } = await api.post('/users/wishlist', { productId });
      set({ wishlist: data });
    } catch (error) {
      console.error(error);
    }
  },
  
  removeFromWishlist: async (productId) => {
    try {
      const { data } = await api.delete(`/users/wishlist/${productId}`);
      set({ wishlist: data });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useWishlistStore;
