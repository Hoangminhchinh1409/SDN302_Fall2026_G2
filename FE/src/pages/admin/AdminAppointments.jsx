import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAppointmentStore from '../../store/useAppointmentStore';
import useAuthStore from '../../store/useAuthStore';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const APPOINTMENT_TRANSITIONS = {
  Pending: ['Pending', 'Confirmed', 'Cancelled'],
  Confirmed: ['Confirmed', 'Completed', 'Cancelled'],
  Completed: ['Completed'],
  Cancelled: ['Cancelled'],
};

const AdminAppointments = () => {
  const {
    appointments,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    loading,
    error,
  } = useAppointmentStore();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentTab = searchParams.get('status') || 'all';

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const isAdmin = user?.role === 'admin';

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setFeedback(null);
    const result = await updateAppointmentStatus(id, status);
    setUpdatingId(null);
    if (result.success) {
      setFeedback({ type: 'success', text: 'Cập nhật trạng thái thành công.' });
    } else {
      setFeedback({ type: 'error', text: result.message || 'Cập nhật thất bại.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;
    setFeedback(null);
    const result = await deleteAppointment(id);
    if (!result.success) {
      setFeedback({ type: 'error', text: result.message || 'Xóa lịch hẹn thất bại.' });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const filteredAppointments = appointments.filter((appt) => {
    // Filter by tab
    if (currentTab === 'today') {
      if (!isToday(appt.date)) return false;
    } else if (currentTab !== 'all') {
      if (appt.status !== currentTab) return false;
    }

    // Filter by search term
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      (appt.user?.name && appt.user.name.toLowerCase().includes(term)) ||
      (appt.pet?.name && appt.pet.name.toLowerCase().includes(term)) ||
      (appt.pet?.type && appt.pet.type.toLowerCase().includes(term)) ||
      (appt.service?.name && appt.service.name.toLowerCase().includes(term))
    );
  });

  const todayCount = appointments.filter((a) => isToday(a.date)).length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn (Appointments)</h2>
          <p className="text-sm text-gray-500">Xác nhận, theo dõi và hoàn tất lịch dịch vụ thú cưng.</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên khách, thú cưng, dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`p-3 rounded-lg text-sm font-medium ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => {
            searchParams.delete('status');
            setSearchParams(searchParams);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
            currentTab === 'all'
              ? 'bg-brand-orange text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>Tất cả</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">{appointments.length}</span>
        </button>

        <button
          onClick={() => setSearchParams({ status: 'today' })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
            currentTab === 'today'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <span>Hôm nay</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 text-blue-900">{todayCount}</span>
        </button>

        <button
          onClick={() => setSearchParams({ status: 'Pending' })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
            currentTab === 'Pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
          }`}
        >
          <span>Chờ duyệt</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-yellow-200 text-yellow-900">{pendingCount}</span>
        </button>

        {['Confirmed', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setSearchParams({ status: st })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === st
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {st} ({appointments.filter((a) => a.status === st).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading appointments...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-bold">THỜI GIAN</th>
                  <th className="p-4 font-bold">KHÁCH HÀNG</th>
                  <th className="p-4 font-bold">THÚ CƯNG</th>
                  <th className="p-4 font-bold">DỊCH VỤ</th>
                  <th className="p-4 font-bold">TRẠNG THÁI</th>
                  <th className="p-4 font-bold text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      Không tìm thấy lịch hẹn nào.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">
                          {new Date(appt.date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(appt.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          {isToday(appt.date) && (
                            <span className="ml-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                              Hôm nay
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-brand-dark">
                        {appt.user?.name || 'N/A'}
                        <div className="text-xs text-gray-400 font-normal">{appt.user?.phone || appt.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{appt.pet?.name || 'N/A'}</span>
                        <span className="text-xs text-gray-400 ml-1">({appt.pet?.type || 'Thú cưng'})</span>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{appt.service?.name || 'N/A'}</td>
                      <td className="p-4">
                        {updatingId === appt._id ? (
                          <span className="text-gray-400 text-xs italic">Đang cập nhật…</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                                appt.status
                              )}`}
                            >
                              {appt.status}
                            </span>

                            {appt.status === 'Pending' && (
                              <button
                                onClick={() => handleStatusChange(appt._id, 'Confirmed')}
                                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-0.5 rounded font-semibold"
                              >
                                Xác nhận
                              </button>
                            )}

                            {appt.status === 'Confirmed' && (
                              <button
                                onClick={() => handleStatusChange(appt._id, 'Completed')}
                                className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded font-semibold"
                              >
                                Hoàn tất
                              </button>
                            )}

                            {appt.status === 'Completed' || appt.status === 'Cancelled' ? (
                              <span className="text-[11px] text-gray-400 italic">Đã kết thúc</span>
                            ) : (
                              <select
                                aria-label="Cập nhật trạng thái lịch hẹn"
                                value={appt.status}
                                onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                                className="border border-gray-300 rounded text-xs px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
                              >
                                {(APPOINTMENT_TRANSITIONS[appt.status] || [appt.status]).map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(appt._id)}
                            className="text-red-500 hover:text-red-700 underline text-xs"
                            aria-label={`Xóa lịch hẹn ${appt._id}`}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
