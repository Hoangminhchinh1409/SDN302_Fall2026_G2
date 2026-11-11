import { useState, useEffect } from 'react';
import useServiceStore from '../store/useServiceStore';
import useAppointmentStore from '../store/useAppointmentStore';
import useAuthStore from '../store/useAuthStore';
import usePetProfileStore from '../store/usePetProfileStore';
import useLanguageStore from '../store/useLanguageStore';
import { Link, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const { services, fetchServices } = useServiceStore();
  const { createAppointment, loading, error } = useAppointmentStore();
  const { user } = useAuthStore();
  const { pets, fetchPets, loading: petsLoading, error: petsError } = usePetProfileStore();
  const { language } = useLanguageStore();
  const navigate = useNavigate();

  const [serviceId, setServiceId] = useState('');
  const [petId, setPetId] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchPets();
  }, [fetchServices, fetchPets]);

  useEffect(() => {
    if (!petId && pets.length === 1) setPetId(pets[0]._id);
  }, [pets, petId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert(language === 'vi' ? 'Vui lòng đăng nhập để đặt lịch!' : 'Please login to book!');
    const ok = await createAppointment({ serviceId, petId, date });
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/my-appointments'), 1500);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-24 px-4">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">
          {language === 'vi' ? 'Vui lòng đăng nhập' : 'Please Sign In'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {language === 'vi' ? 'Bạn cần đăng nhập để đặt lịch hẹn chăm sóc thú cưng.' : 'Please sign in to book an appointment for your pet.'}
        </p>
        <Link to="/login" className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition">
          {language === 'vi' ? 'Đăng nhập ngay' : 'Sign In Now'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-extrabold text-brand-dark mb-6 text-center tracking-tight">
          {language === 'vi' ? 'Đặt lịch dịch vụ' : 'Book a Service'}
        </h1>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 mb-5 rounded-xl text-center text-sm font-semibold">
            {language === 'vi' ? 'Đặt lịch hẹn thành công! Đang chuyển hướng…' : 'Appointment booked successfully! Redirecting…'}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 mb-5 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {petsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 mb-5 rounded-xl text-center text-sm">
            {petsError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pet" className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Chọn thú cưng của bạn' : 'Choose your pet'}
            </label>
            {pets.length > 0 ? (
              <select
                id="pet"
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-sm"
                required
                disabled={petsLoading}
              >
                <option value="">{language === 'vi' ? '-- Chọn thú cưng --' : '-- Select a pet --'}</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>{pet.name} ({pet.type})</option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                {petsLoading ? (
                  language === 'vi' ? 'Đang tải hồ sơ thú cưng…' : 'Loading your pet profiles…'
                ) : (
                  <>
                    {language === 'vi' ? 'Bạn cần thêm hồ sơ thú cưng trước khi đặt lịch. ' : 'Add a pet profile before booking. '}
                    <Link to="/pets" className="font-bold underline text-brand-orange">
                      {language === 'vi' ? 'Quản lý hồ sơ bé' : 'Manage pet profiles'}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Chọn dịch vụ' : 'Select Service'}
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-sm"
              required
            >
              <option value="">{language === 'vi' ? '-- Chọn dịch vụ --' : '-- Choose a service --'}</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.name} - ${s.price}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'vi' ? 'Ngày & Giờ hẹn' : 'Date & Time'}
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || petsLoading || pets.length === 0}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition duration-300 shadow-md disabled:bg-gray-300 cursor-pointer text-sm"
          >
            {loading ? (language === 'vi' ? 'Đang đặt lịch…' : 'Booking...') : (language === 'vi' ? 'Xác nhận đặt lịch' : 'Confirm Booking')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
