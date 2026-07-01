import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Calendar, Clock, ArrowLeft, HeartPulse, ShieldAlert, Award } from 'lucide-react';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/doctors');
                setDoctors(data);
                if (data.length > 0) setDoctorId(data[0].doctor_id);
            } catch (err) {
                setError('Failed to load specialists list.');
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/appointments', {
                doctor_id: doctorId,
                date,
                time
            });
            navigate('/patient');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to schedule appointment. Please try a different slot.');
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <button 
                    onClick={() => navigate('/patient')} 
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Book Consultation</h1>
                    <p className="text-slate-500 text-sm">Schedule a checkup with our medical specialists.</p>
                </div>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Column 1: Clinic Rules/Info (2 cols) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card p-6 bg-gradient-to-br from-brand-900 to-brand-950 text-white border-brand-950 shadow-md">
                        <div className="bg-brand-500/20 p-3 rounded-2xl w-fit mb-5">
                            <HeartPulse className="w-6 h-6 text-brand-300" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Our Healthcare Quality</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                            HealthSync connects you with board-certified healthcare professionals. All consultations are securely recorded in your local patient database.
                        </p>
                        <div className="space-y-3.5 pt-2">
                            <div className="flex items-center text-xs font-bold text-slate-200">
                                <Award className="w-4 h-4 mr-2.5 text-brand-400 shrink-0" /> Fast Booking Approvals
                            </div>
                            <div className="flex items-center text-xs font-bold text-slate-200">
                                <ShieldAlert className="w-4 h-4 mr-2.5 text-brand-400 shrink-0" /> Double-Booking Blockers
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 bg-slate-50 border-slate-200/60 shadow-none">
                        <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-brand-500" /> Operating Standards
                        </h4>
                        <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                            <li>• Appointments are available between **08:00 AM** and **06:00 PM**.</li>
                            <li>• Double-bookings on the same doctor at the same slot are automatically checked.</li>
                            <li>• Please cancel at least 2 hours before the scheduled time if you cannot make it.</li>
                        </ul>
                    </div>
                </div>

                {/* Column 2: Booking Form (3 cols) */}
                <div className="md:col-span-3 card p-8 border-slate-100 shadow-lg shadow-brand-500/5 bg-white/80">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200/50 text-rose-600 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center">
                                <User className="w-3.5 h-3.5 mr-1.5 text-brand-500" /> Choose Medical Specialist
                            </label>
                            <select
                                required
                                className="input-field cursor-pointer"
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                            >
                                {doctors.map(doc => (
                                    <option key={doc.doctor_id} value={doc.doctor_id}>
                                        Dr. {doc.name} — {doc.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-500" /> Target Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={today}
                                    className="input-field"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-500" /> Start Time
                                </label>
                                <input
                                    type="time"
                                    required
                                    className="input-field"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    min="08:00"
                                    max="18:00"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-4 text-base shadow-md"
                        >
                            {loading ? 'Confirming Visit...' : 'Confirm Appointment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
