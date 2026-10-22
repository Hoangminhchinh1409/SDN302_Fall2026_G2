import { create } from 'zustand';
import api from '../api/axios';

const useProductStore = create((set) => ({
  products: [],
  product: null,
  pages: 1,
  page: 1,
  totalCount: 0,
  isLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          if (Array.isArray(params[key])) {
            params[key].forEach(val => queryParams.append(key, val));
          } else {
            queryParams.append(key, params[key]);
          }
        }
      });
      const queryString = queryParams.toString();
      const query = queryString ? `/products?${queryString}` : '/products';
      
      const { data } = await api.get(query);
      set({ 
        products: data.products, 
        pages: data.pages, 
        page: data.page, 
        totalCount: data.totalCount,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to load products', 
        isLoading: false 
      });
    }
  },

  fetchProductDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ product: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to load product details', 
        isLoading: false 
      });
    }
  },

  clearProductDetails: () => set({ product: null }),
}));

export default useProductStore;
