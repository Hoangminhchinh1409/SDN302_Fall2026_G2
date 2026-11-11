import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAppointmentStore from '../store/useAppointmentStore';
import useAuthStore from '../store/useAuthStore';
import useLanguageStore from '../store/useLanguageStore';

const MyAppointments = () => {
  const { appointments, fetchAppointments, cancelAppointment, loading, error } = useAppointmentStore();
  const { user } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

  const handleCancel = async (id) => {
    const confirmMsg = language === 'vi' ? 'Bạn có chắc muốn hủy lịch hẹn này?' : 'Are you sure you want to cancel this appointment?';
    if (!window.confirm(confirmMsg)) return;
    setCancellingId(id);
    setFeedback(null);
    const result = await cancelAppointment(id);
    setCancellingId(null);
    if (result.success) {
      setFeedback({ type: 'success', text: language === 'vi' ? 'Hủy lịch hẹn thành công.' : 'Appointment cancelled successfully.' });
    } else {
      setFeedback({ type: 'error', text: result.message || (language === 'vi' ? 'Không thể hủy lịch hẹn.' : 'Failed to cancel appointment.') });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {t('status_pending')}
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <i className="fas fa-calendar-check text-[10px]"></i>
            {t('status_confirmed')}
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <i className="fas fa-check-circle text-[10px]"></i>
            {t('status_completed')}
          </span>
        );
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <i className="fas fa-times-circle text-[10px]"></i>
            {t('status_cancelled')}
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold mb-2">{language === 'vi' ? 'Vui lòng đăng nhập' : 'Please Sign In'}</h2>
        <p className="text-sm text-gray-500 mb-4">{language === 'vi' ? 'Bạn cần đăng nhập để theo dõi lịch hẹn chăm sóc thú cưng.' : 'Please sign in to track your pet care appointments.'}</p>
        <Link to="/login" className="bg-brand-dark text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition">
          {language === 'vi' ? 'Đăng nhập ngay' : 'Sign In Now'}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">{t('my_appts_title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('my_appts_sub')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pets"
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-bold transition"
            >
              {t('pet_profiles_btn')}
            </Link>
            <Link
              to="/book-appointment"
              className="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm"
            >
              {t('book_new_appt')}
            </Link>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <i className={`fas ${feedback.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {feedback.text}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl mb-6 bg-red-50 text-red-800 border border-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-400">Đang tải lịch hẹn…</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="far fa-calendar-alt"></i>
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">{t('no_appts_title')}</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              {t('no_appts_sub')}
            </p>
            <Link
              to="/book-appointment"
              className="inline-block bg-brand-dark text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition"
            >
              {t('book_now')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => {
              const apptDate = new Date(appt.date);
              const isPast = apptDate < new Date();
              const canCancel = appt.status === 'Pending';

              return (
                <div
                  key={appt._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center shrink-0 text-xl border border-orange-100">
                      <i className={`fas fa-${appt.pet?.type?.toLowerCase() === 'cat' ? 'cat' : 'dog'}`}></i>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-brand-dark">
                          {appt.service?.name || (language === 'vi' ? 'Dịch vụ chăm sóc' : 'Care Service')}
                        </h2>
                        {getStatusBadge(appt.status)}
                      </div>

                      <div className="text-sm text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>
                          <strong>{t('pet_label')}</strong> {appt.pet?.name || (language === 'vi' ? 'Chưa chọn' : 'Not specified')} ({appt.pet?.type || 'Pet'})
                        </span>
                        <span>
                          <strong>{t('duration_label')}</strong> {appt.service?.durationMinutes || 45} {t('mins')}
                        </span>
                        <span>
                          <strong>{t('service_price_label')}</strong> ${appt.service?.price || 0}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 flex items-center gap-2 pt-1">
                        <i className="far fa-clock text-brand-orange"></i>
                        <span>
                          {t('appt_time_label')} <strong className="text-brand-dark">{apptDate.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</strong>
                        </span>
                        {isPast && appt.status === 'Pending' && (
                          <span className="text-red-500 italic">{t('past_due_tag')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                    {canCancel && (
                      <button
                        type="button"
                        disabled={cancellingId === appt._id}
                        onClick={() => handleCancel(appt._id)}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === appt._id ? t('cancelling') : t('cancel_appt_btn')}
                      </button>
                    )}
                    <Link
                      to="/book-appointment"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-dark rounded-lg text-xs font-bold transition"
                    >
                      {t('book_more')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
