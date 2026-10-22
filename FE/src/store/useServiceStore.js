import { create } from 'zustand';
import axios from 'axios';

const useServiceStore = create((set) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get('/api/services');
      set({ services: data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        loading: false,
      });
    }
  },
}));

export default useServiceStore;
