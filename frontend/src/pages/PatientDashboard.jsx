import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, User, XCircle, ArrowRight, ShieldCheck, Heart, Star, Users } from 'lucide-react';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const apptRes = await api.get('/appointments');
            setAppointments(apptRes.data);
            const docRes = await api.get('/doctors');
            setDoctors(docRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchData(); // Refresh the list
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

    // Get closest scheduled appointment
    const nextAppointment = scheduled.length > 0
        ? scheduled.reduce((earliest, current) => {
            const dateE = new Date(`${earliest.date} ${earliest.time}`);
            const dateC = new Date(`${current.date} ${current.time}`);
            return dateC < dateE ? current : earliest;
          })
        : null;

    // Static reviews/availabilities mapping for mock UX
    const getDoctorDetails = (id) => {
        const rating = (id % 2 === 0) ? "4.9" : "4.8";
        const reviews = (id % 2 === 0) ? "32" : "18";
        const isAvailable = (id % 3 !== 0);
        return { rating, reviews, isAvailable };
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            
            {/* Banner Greeting */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-950/20 relative overflow-hidden border border-slate-800">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-10 translate-x-10 pointer-events-none">
                    <Heart className="w-80 h-80 text-white" />
                </div>
                <div className="relative z-10 max-w-xl space-y-4">
                    <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Patient Hub
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Your Health. Simplified.</h1>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        Welcome to your health hub. Schedule consultations, browse specialists, and keep track of your appointment logs.
                    </p>
                    <div className="pt-2">
                        <Link to="/patient/book" className="btn-primary inline-flex items-center">
                            Book New Appointment <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center space-x-4 border-slate-200/60 bg-white/80">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming Visits</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{scheduled.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-200/60 bg-white/80">
                    <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shadow-sm border border-teal-100">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Treatments</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{completed.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-200/60 bg-white/80">
                    <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl shadow-sm border border-brand-100">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Consultation</p>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[200px] mt-1">
                            {nextAppointment ? `${nextAppointment.date} at ${nextAppointment.time}` : 'No upcoming visits'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Screen Grid (Appointments vs Recommended Doctors) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: Appointments List (2 cols) */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                        <h2 className="text-xl font-bold text-slate-900">Your Appointment History</h2>
                        <span className="text-xs font-bold text-slate-400">{appointments.length} Visits</span>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="card p-12 text-center border-dashed border-2 border-slate-200 bg-white/40 flex flex-col items-center justify-center">
                            <Calendar className="h-12 w-12 text-slate-300 mb-4 animate-pulse-slow" />
                            <h3 className="text-base font-bold text-slate-800 mb-1">No scheduled consultations</h3>
                            <p className="text-xs text-slate-500 mb-5 max-w-xs">You have no upcoming or historic appointments logged in the system.</p>
                            <Link to="/patient/book" className="btn-primary py-2.5 text-sm">
                                Book Your First Consultation
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2">
                            {appointments.map((appt) => (
                                <div key={appt.id} className="card-interactive p-6 flex flex-col justify-between bg-white/80 border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/5 rounded-bl-full pointer-events-none -z-10"></div>
                                    
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
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
                                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                                                    DR
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-bold text-slate-800 text-sm">Dr. {appt.doctor_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{appt.specialization}</p>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-100/80 pt-4 grid grid-cols-2 gap-4">
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

                {/* Column 2: Recommended Doctors (1 col) */}
                <div className="space-y-5">
                    <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                        <h2 className="text-xl font-bold text-slate-900">Featured Specialists</h2>
                        <Link to="/doctors" className="text-xs font-bold text-brand-600 hover:text-brand-500 hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {doctors.slice(0, 3).map((doc) => {
                            const details = getDoctorDetails(doc.doctor_id);
                            return (
                                <div key={doc.doctor_id} className="card p-4 flex flex-col justify-between border-slate-100 bg-white/80 relative overflow-hidden shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border border-brand-100">
                                                <User className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-bold text-slate-800 text-sm">Dr. {doc.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{doc.specialization}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                                            ${details.isAvailable ? 'bg-teal-50 text-teal-700 border border-teal-200/50' : 'bg-slate-100 text-slate-500'}
                                        `}>
                                            {details.isAvailable ? 'Available Today' : 'Unavailable'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100/80 pt-3 mt-1">
                                        <div className="flex items-center text-slate-600">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                                            <span className="text-xs font-bold text-slate-700">{details.rating}</span>
                                            <span className="text-[10px] text-slate-400 ml-1">({details.reviews} reviews)</span>
                                        </div>
                                        <Link 
                                            to="/patient/book" 
                                            state={{ doctorId: doc.doctor_id }}
                                            className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center"
                                        >
                                            Book Visit <ArrowRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                        {doctors.length === 0 && (
                            <p className="text-xs text-slate-400 text-center py-6 font-medium">No doctors currently registered.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientDashboard;
