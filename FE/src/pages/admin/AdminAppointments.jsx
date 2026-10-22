import React, { useEffect } from 'react';
import useAppointmentStore from '../../store/useAppointmentStore';

const AdminAppointments = () => {
  const { appointments, fetchAppointments, loading, error } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments Management</h2>
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
                    <td className="p-4">{appt.pet?.name || 'N/A'} ({appt.pet?.type})</td>
                    <td className="p-4">{appt.service?.name || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-brand-orange hover:text-orange-700 underline text-sm">
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">No appointments found.</td>
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
