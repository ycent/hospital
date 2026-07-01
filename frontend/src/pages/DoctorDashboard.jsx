import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Users, Activity, Clock } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    const scheduled = appointments.filter(a => a.status === 'Scheduled');
    const past = appointments.filter(a => a.status !== 'Scheduled');
    const completed = appointments.filter(a => a.status === 'Completed');

    const renderTable = (list, showActions) => (
        <div className="card border-slate-100 overflow-hidden shadow-md shadow-brand-500/5 bg-white/80">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/70">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</th>
                            {showActions && <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Console Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-slate-100/60">
                        {list.map((appt) => (
                            <tr key={appt.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{appt.patient_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{appt.date} at {appt.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={
                                        appt.status === 'Scheduled' ? 'badge-scheduled' :
                                        appt.status === 'Completed' ? 'badge-completed' :
                                        'badge-cancelled'
                                    }>
                                        {appt.status}
                                    </span>
                                </td>
                                {showActions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                        <button 
                                            onClick={() => updateStatus(appt.id, 'Completed')}
                                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-xl transition-all duration-200"
                                            title="Mark as Completed"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(appt.id, 'Cancelled')}
                                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all duration-200"
                                            title="Cancel Appointment"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr>
                                <td colSpan={showActions ? "4" : "3"} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                                    No appointments scheduled in this section.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Title Section */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Console</h1>
                <p className="text-slate-500 text-sm">Review your custom clinic timeline, patients, and visit states.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Visits</p>
                        <p className="text-2xl font-extrabold text-slate-900">{scheduled.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shadow-sm border border-teal-100">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Treatments</p>
                        <p className="text-2xl font-extrabold text-slate-900">{completed.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl shadow-sm border border-brand-100">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                            {new Set(appointments.map(a => a.patient_name)).size}
                        </p>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments Table */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-brand-500" /> Action Required
                </h2>
                {renderTable(scheduled, true)}
            </div>

            {/* Past/Cancelled Table */}
            <div className="space-y-4 pt-4">
                <h2 className="text-lg font-bold text-slate-400 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-slate-400" /> Historic logs
                </h2>
                {renderTable(past, false)}
            </div>
        </div>
    );
};

export default DoctorDashboard;
