import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, User, XCircle, ArrowRight, ShieldCheck, Heart, FileText } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    const scheduled = appointments.filter(a => a.status === 'Scheduled');
    const completed = appointments.filter(a => a.status === 'Completed');

    // Get date of the closest scheduled appointment
    const nextAppointment = scheduled.length > 0
        ? scheduled.reduce((earliest, current) => {
            const dateE = new Date(`${earliest.date} ${earliest.time}`);
            const dateC = new Date(`${current.date} ${current.time}`);
            return dateC < dateE ? current : earliest;
          })
        : null;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Banner Greeting Card */}
            <div className="bg-gradient-to-r from-brand-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-950/20 relative overflow-hidden border border-brand-950">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-10 translate-x-10 pointer-events-none">
                    <Heart className="w-80 h-80 text-white" />
                </div>
                <div className="relative z-10 max-w-xl space-y-4">
                    <span className="bg-brand-500/30 text-brand-300 border border-brand-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Patient Hub
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Health, Synchronized.</h1>
                    <p className="text-slate-300 text-sm sm:text-base">
                        Welcome to your dashboard. Schedule consultations, view medical specialists, and stay on top of your upcoming check-ups easily.
                    </p>
                    <div className="pt-2">
                        <Link to="/patient/book" className="btn-primary inline-flex items-center bg-brand-500 hover:bg-brand-600 border-none px-6 py-3">
                            Book New Appointment <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Visits</p>
                        <p className="text-2xl font-extrabold text-slate-900">{scheduled.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shadow-sm border border-teal-100">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Visits</p>
                        <p className="text-2xl font-extrabold text-slate-900">{completed.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl shadow-sm border border-brand-100">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Consult</p>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                            {nextAppointment ? `${nextAppointment.date} at ${nextAppointment.time}` : 'No upcoming visits'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Appointments Section */}
            <div className="space-y-5">
                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-3">
                    <h2 className="text-xl font-bold text-slate-900">Your Appointment History</h2>
                    <span className="text-xs font-bold text-slate-400">{appointments.length} Total</span>
                </div>

                {appointments.length === 0 ? (
                    <div className="card p-12 text-center border-dashed border-2 border-slate-200 flex flex-col items-center justify-center bg-white/40">
                        <Calendar className="h-14 w-14 text-slate-300 mb-4 animate-pulse-slow" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Ready for your first consultation?</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-sm">You haven't scheduled any medical check-ups yet. Book one today to see our specialists.</p>
                        <Link to="/patient/book" className="btn-primary">
                            Book Your First Visit
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {appointments.map((appt) => (
                            <div key={appt.id} className="card-interactive p-6 flex flex-col justify-between border-slate-100/50 relative overflow-hidden bg-white/80">
                                {/* Soft top right circle */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full pointer-events-none -z-10"></div>
                                
                                <div>
                                    <div className="flex justify-between items-start mb-5">
                                        <span className={
                                            appt.status === 'Scheduled' ? 'badge-scheduled' :
                                            appt.status === 'Completed' ? 'badge-completed' :
                                            'badge-cancelled'
                                        }>
                                            {appt.status}
                                        </span>
                                        {appt.status === 'Scheduled' && (
                                            <button 
                                                onClick={() => handleCancel(appt.id)}
                                                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                                                title="Cancel Appointment"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 shadow-sm border border-brand-100">
                                                {appt.doctor_name.split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-bold text-slate-800 text-sm sm:text-base">Dr. {appt.doctor_name}</p>
                                                <p className="text-xs text-slate-500 font-semibold">{appt.specialization}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                                            <div className="flex items-center text-slate-600">
                                                <Calendar className="w-4 h-4 mr-2 text-brand-500 shrink-0" />
                                                <span className="text-xs font-semibold">{appt.date}</span>
                                            </div>
                                            <div className="flex items-center text-slate-600">
                                                <Clock className="w-4 h-4 mr-2 text-brand-500 shrink-0" />
                                                <span className="text-xs font-semibold">{appt.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
