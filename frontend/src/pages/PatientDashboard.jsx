import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, User, XCircle } from 'lucide-react';

const PatientDashboard = () => {
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

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error('Failed to cancel appointment', error);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-500 mt-1">Manage your upcoming check-ups</p>
                </div>
                <Link to="/patient/book" className="btn-primary flex items-center shadow-sm">
                    <Calendar className="w-4 h-4 mr-2" /> Book New
                </Link>
            </div>

            {appointments.length === 0 ? (
                <div className="card p-12 text-center border-dashed border-2">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
                    <p className="text-gray-500 mb-4">You have no upcoming or past appointments.</p>
                    <Link to="/patient/book" className="btn-primary inline-flex items-center">
                        Book Your First Appointment
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="card p-6 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                                      appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {appt.status}
                                </span>
                                {appt.status === 'Scheduled' && (
                                    <button 
                                        onClick={() => handleCancel(appt.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Cancel Appointment"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-3 mb-4 flex-grow">
                                <div className="flex items-center text-gray-700">
                                    <User className="w-4 h-4 mr-3 text-brand-500 shrink-0" />
                                    <div>
                                        <p className="font-medium">{appt.doctor_name}</p>
                                        <p className="text-xs text-gray-500">{appt.specialization}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="w-4 h-4 mr-3 text-brand-500 shrink-0" />
                                    <span className="text-sm">{appt.date}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Clock className="w-4 h-4 mr-3 text-brand-500 shrink-0" />
                                    <span className="text-sm">{appt.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
