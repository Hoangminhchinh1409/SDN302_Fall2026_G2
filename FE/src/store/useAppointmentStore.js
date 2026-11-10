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
  },

  updateAppointmentStatus: async (id, status) => {
    set({ error: null });
    try {
      const { data } = await api.put(`/appointments/${id}/status`, { status });
      set((state) => ({
        appointments: state.appointments.map((appt) => (appt._id === id ? data : appt))
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message });
      return { success: false, message };
    }
  },

  deleteAppointment: async (id) => {
    set({ error: null });
    try {
      await api.delete(`/appointments/${id}`);
      set((state) => ({
        appointments: state.appointments.filter((appt) => appt._id !== id)
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message });
      return { success: false, message };
    }
  }
}));

export default useAppointmentStore;
