import { create } from 'zustand';
import api from '../api/axios';

const useOrderStore = create((set) => ({
  orders: [],
  myOrders: [],
  orderDetails: null,
  isLoading: false,
  error: null,
  successMessage: null,

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { data } = await api.post('/orders', orderData);
      set({ 
        orderDetails: data, 
        isLoading: false,
        successMessage: 'Order placed successfully'
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to place order', 
        isLoading: false 
      });
      return null;
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/orders/myorders');
      set({ myOrders: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch your orders', 
        isLoading: false 
      });
    }
  },

  fetchOrderDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/orders/${id}`);
      set({ orderDetails: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch order details', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null, successMessage: null }),
}));

export default useOrderStore;
