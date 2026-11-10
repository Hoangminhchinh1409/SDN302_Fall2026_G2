import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppointmentStore from '../store/useAppointmentStore';
import useAuthStore from '../store/useAuthStore';

const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
};

const MyAppointments = () => {
    const { appointments, fetchAppointments, cancelAppointment, loading, error } = useAppointmentStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) fetchAppointments();
    }, [user, fetchAppointments]);

    const handleCancel = async (appointmentId) => {
        if (window.confirm('Cancel this appointment?')) {
            await cancelAppointment(appointmentId);
        }
    };

    return (
        <main className="min-h-[70vh] bg-gray-50 px-4 py-12 md:px-12 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-orange">Spa & Care</p>
                        <h1 className="text-3xl font-bold text-brand-dark">My Appointments</h1>
                    </div>
                    <Link to="/book-appointment" className="inline-flex items-center gap-2 rounded bg-brand-orange px-4 py-2.5 font-medium text-white hover:bg-orange-600">
                        <i className="fas fa-calendar-plus" aria-hidden="true"></i> Book a service
                    </Link>
                </div>

                {error && <div role="alert" className="mb-5 rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

                {loading && appointments.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center">
                        <i className="fas fa-calendar-alt mb-4 text-3xl text-gray-300" aria-hidden="true"></i>
                        <h2 className="mb-2 text-lg font-semibold text-brand-dark">No appointments yet</h2>
                        <p className="mb-5 text-gray-500">Your service bookings will appear here.</p>
                        <Link to="/book-appointment" className="font-medium text-brand-orange hover:underline">Book your first service</Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                                        <th className="p-4 font-semibold">Date & time</th>
                                        <th className="p-4 font-semibold">Pet</th>
                                        <th className="p-4 font-semibold">Service</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 text-right font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => {
                                        const canCancel = ['Pending', 'Confirmed'].includes(appointment.status)
                                            && new Date(appointment.date) > new Date();

                                        return (
                                            <tr key={appointment._id} className="border-b border-gray-100 last:border-0">
                                                <td className="p-4 text-sm text-gray-700">{new Date(appointment.date).toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className="font-medium text-brand-dark">{appointment.pet?.name || 'Pet removed'}</span>
                                                    {appointment.pet?.type && <span className="ml-1 text-sm text-gray-500">({appointment.pet.type})</span>}
                                                </td>
                                                <td className="p-4 text-sm text-gray-700">{appointment.service?.name || 'Service unavailable'}</td>
                                                <td className="p-4">
                                                    <span className={`rounded px-2.5 py-1 text-xs font-semibold ${statusStyles[appointment.status] || 'bg-gray-100 text-gray-700'}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {canCancel ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCancel(appointment._id)}
                                                            disabled={loading}
                                                            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : <span className="text-sm text-gray-400">-</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyAppointments;