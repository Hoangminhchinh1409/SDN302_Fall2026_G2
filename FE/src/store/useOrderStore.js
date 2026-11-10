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

  fetchMyOrders: async (status = '', filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
      const url = `/orders/myorders${params.toString() ? `?${params}` : ''}`;
      const { data } = await api.get(url);
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

  cancelOrder: async (id, reason = '') => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { data } = await api.put(`/orders/${id}/cancel`, { reason });
      set((state) => ({
        orderDetails: data,
        myOrders: state.myOrders.map((order) => (order._id === id ? data : order)),
        isLoading: false,
        successMessage: 'Order cancelled successfully',
      }));
      return { success: true, order: data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to cancel order';
      set({ 
        error: errorMsg, 
        isLoading: false 
      });
      return { success: false, message: errorMsg };
    }
  },

  clearError: () => set({ error: null, successMessage: null }),
}));

export default useOrderStore;
