import React, { useEffect, useState } from 'react';
import useAppointmentStore from '../../store/useAppointmentStore';
import useAuthStore from '../../store/useAuthStore';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const AdminAppointments = () => {
  const { appointments, fetchAppointments, updateAppointmentStatus, deleteAppointment, loading, error } =
    useAppointmentStore();
  const { user } = useAuthStore();
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments Management</h2>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading appointments...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">DATE</th>
                  <th className="p-4 font-medium">CUSTOMER</th>
                  <th className="p-4 font-medium">PET</th>
                  <th className="p-4 font-medium">SERVICE</th>
                  <th className="p-4 font-medium">STATUS</th>
                  <th className="p-4 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{new Date(appt.date).toLocaleString()}</td>
                    <td className="p-4 font-medium text-brand-dark">{appt.user?.name || 'N/A'}</td>
                    <td className="p-4">
                      {appt.pet?.name || 'N/A'} ({appt.pet?.type || 'N/A'})
                    </td>
                    <td className="p-4">{appt.service?.name || 'N/A'}</td>
                    <td className="p-4">
                      {updatingId === appt._id ? (
                        <span className="text-gray-400 text-xs italic">Đang cập nhật…</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(appt.status)}`}
                          >
                            {appt.status}
                          </span>
                          <select
                            aria-label="Cập nhật trạng thái lịch hẹn"
                            value={appt.status}
                            onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                            className="border border-gray-300 rounded-md text-xs px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(appt._id)}
                          className="text-red-500 hover:text-red-700 underline text-sm"
                          aria-label={`Xóa lịch hẹn ${appt._id}`}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
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
