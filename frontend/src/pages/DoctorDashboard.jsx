import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            fetchAppointments(); // refresh
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    const scheduled = appointments.filter(a => a.status === 'Scheduled');
    const past = appointments.filter(a => a.status !== 'Scheduled');

    const renderTable = (list, showActions) => (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        {showActions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {list.map((appt) => (
                        <tr key={appt.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patient_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.date} at {appt.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                                      appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {appt.status}
                                </span>
                            </td>
                            {showActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button 
                                        onClick={() => updateStatus(appt.id, 'Completed')}
                                        className="text-green-600 hover:text-green-900 mx-1"
                                        title="Mark as Completed"
                                    >
                                        <CheckCircle className="w-5 h-5 inline" />
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(appt.id, 'Cancelled')}
                                        className="text-red-600 hover:text-red-900 mx-1"
                                        title="Cancel Appointment"
                                    >
                                        <XCircle className="w-5 h-5 inline" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {list.length === 0 && (
                        <tr>
                            <td colSpan={showActions ? "4" : "3"} className="px-6 py-8 text-center text-gray-500">
                                No appointments found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-500 mb-8">Manage your schedule and appointments.</p>

            <div className="mb-10">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-brand-500" /> Upcoming Appointments
                </h2>
                {renderTable(scheduled, true)}
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 text-gray-500 flex items-center">
                    Past / Cancelled Appointments
                </h2>
                {renderTable(past, false)}
            </div>
        </div>
    );
};

export default DoctorDashboard;
