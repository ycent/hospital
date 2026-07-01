import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, UserRound, Stethoscope, Trash2, Mail, Lock, ShieldCheck, Heart } from 'lucide-react';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    
    // New doctor form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');

    const fetchData = async () => {
        try {
            const docRes = await api.get('/doctors');
            setDoctors(docRes.data);
            const apptRes = await api.get('/appointments');
            setAppointments(apptRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/doctors', { name, email, password, specialization });
            setName('');
            setEmail('');
            setPassword('');
            setSpecialization('');
            fetchData();
            alert('Doctor added successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding doctor');
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to remove this doctor?')) return;
        try {
            await api.delete(`/doctors/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting doc', error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Controls</h1>
                <p className="text-slate-500 text-sm">Overview of clinic operations, doctors, and user bookings.</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl shadow-sm border border-brand-100">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Specialists</p>
                        <p className="text-2xl font-extrabold text-slate-900">{doctors.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4 border-slate-100/50">
                    <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                        <UserRound className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                        <p className="text-2xl font-extrabold text-slate-900">{appointments.length}</p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manage Doctors */}
                <div className="card p-6 border-slate-100/50 bg-white/80">
                    <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center border-b border-slate-100 pb-3">
                        <Stethoscope className="w-5 h-5 mr-2 text-brand-500" /> Manage Doctors
                    </h2>
                    
                    {/* Add Doctor form */}
                    <form onSubmit={handleAddDoctor} className="space-y-4 mb-8 bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-2">
                            <UserPlus className="w-4 h-4 mr-1.5 text-brand-500" /> Add New Doctor
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                                className="input-field py-2 text-sm bg-white" 
                                placeholder="Full Name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                            />
                            <input 
                                className="input-field py-2 text-sm bg-white" 
                                placeholder="Specialization" 
                                value={specialization} 
                                onChange={e => setSpecialization(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                                className="input-field py-2 text-sm bg-white" 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                            <input 
                                className="input-field py-2 text-sm bg-white" 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full text-sm py-2.5 mt-2">
                            Create Doctor Account
                        </button>
                    </form>

                    {/* Doctors list */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {doctors.map(doc => (
                            <div key={doc.doctor_id} className="flex justify-between items-center p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 font-bold text-xs shrink-0 border border-brand-100 shadow-sm">
                                        {doc.name.split(' ').map(n=>n[0]).join('')}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                                        <p className="text-xs text-slate-500 font-semibold">{doc.specialization} • {doc.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteDoctor(doc.doctor_id)} 
                                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all duration-200" 
                                    title="Delete Doctor"
                                >
                                    <Trash2 className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Appointments */}
                <div className="card p-6 border-slate-100/50 bg-white/80">
                    <h2 className="text-lg font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">
                        All System Appointments
                    </h2>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {appointments.map(appt => (
                            <div key={appt.id} className="p-4 border border-slate-100 rounded-xl text-sm bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] border border-indigo-100 shadow-sm">
                                            DR
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm ml-2">Dr. {appt.doctor_name}</span>
                                    </div>
                                    <span className={
                                        appt.status === 'Scheduled' ? 'badge-scheduled' :
                                        appt.status === 'Completed' ? 'badge-completed' :
                                        'badge-cancelled'
                                    }>
                                        {appt.status}
                                    </span>
                                </div>
                                <div className="pl-10 space-y-1">
                                    <p className="text-xs text-slate-500 font-semibold">Patient: <span className="font-bold text-slate-700">{appt.patient_name}</span></p>
                                    <p className="text-slate-400 text-[10px] font-bold">{appt.date} at {appt.time}</p>
                                </div>
                            </div>
                        ))}
                        {appointments.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-10 font-medium">No appointments currently registered.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
