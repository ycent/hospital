import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Calendar, Clock } from 'lucide-react';

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
                setError('Failed to load doctors.');
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
            setError(err.response?.data?.message || 'Failed to book appointment');
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h1>
            <p className="text-gray-500 mb-8">Schedule a new visit with one of our specialists.</p>

            <div className="card p-8">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <User className="w-4 h-4 mr-2 text-brand-500" /> Select Specialist
                        </label>
                        <select
                            required
                            className="input-field"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                        >
                            {doctors.map(doc => (
                                <option key={doc.doctor_id} value={doc.doctor_id}>
                                    {doc.name} - {doc.specialization}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-brand-500" /> Date
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
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-brand-500" /> Time
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
                            <p className="text-xs text-gray-500 mt-1">Operating hours: 08:00 AM - 06:00 PM</p>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4 text-lg shadow-md"
                    >
                        {loading ? 'Booking...' : 'Confirm Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
