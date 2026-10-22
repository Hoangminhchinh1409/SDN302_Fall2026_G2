import { useState, useEffect } from 'react';
import useServiceStore from '../store/useServiceStore';
import useAppointmentStore from '../store/useAppointmentStore';
import useAuthStore from '../store/useAuthStore';

const BookAppointment = () => {
  const { services, fetchServices } = useServiceStore();
  const { createAppointment, loading, error } = useAppointmentStore();
  const { user } = useAuthStore();
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to book!');
    const ok = await createAppointment({ serviceId, date });
    if (ok) setSuccess(true);
  };

  if (!user) return <div className="text-center mt-20">Please login to book an appointment.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Book a Service</h1>
        {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-center">Appointment booked successfully!</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
            <select 
              value={serviceId} 
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">-- Choose a service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.name} - ${s.price}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
            <input 
              type="datetime-local" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
