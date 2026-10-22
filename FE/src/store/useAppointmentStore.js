import { create } from 'zustand';
import api from '../api/axios';

const useAppointmentStore = create((set) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/appointments');
      set({ appointments: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  createAppointment: async (appointmentData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/appointments', appointmentData);
      set((state) => ({ appointments: [...state.appointments, data], loading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return false;
    }
  }
}));

export default useAppointmentStore;
