import { create } from 'zustand';
import api from '../api/axios';

const usePetProfileStore = create((set) => ({
  pets: [],
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/pets');
      set({ pets: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  addPet: async (petData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/pets', petData);
      set((state) => ({ pets: [...state.pets, data], loading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return false;
    }
  },

  removePet: async (id) => {
    try {
      await api.delete(`/pets/${id}`);
      set((state) => ({ pets: state.pets.filter((p) => p._id !== id) }));
    } catch (error) {
      console.error(error);
    }
  }
}));

export default usePetProfileStore;
