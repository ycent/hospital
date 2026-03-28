import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, UserRound, Stethoscope, Trash2 } from 'lucide-react';

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
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-500">System Overview & Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Doctors</p>
                        <p className="text-2xl font-semibold text-gray-900">{doctors.length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <UserRound className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                        <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manage Doctors */}
                <div className="card p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center border-b pb-2">
                        <Stethoscope className="w-5 h-5 mr-2 text-brand-500" /> Manage Doctors
                    </h2>
                    
                    <form onSubmit={handleAddDoctor} className="space-y-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center mb-3">
                            <UserPlus className="w-4 h-4 mr-2" /> Add New Doctor
                        </h3>
                        <input className="input-field py-1.5 text-sm" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                        <input className="input-field py-1.5 text-sm" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input className="input-field py-1.5 text-sm" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <input className="input-field py-1.5 text-sm" placeholder="Specialization (e.g. Neurologist)" value={specialization} onChange={e => setSpecialization(e.target.value)} required />
                        <button type="submit" className="btn-primary w-full text-sm">Create Doctor</button>
                    </form>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {doctors.map(doc => (
                            <div key={doc.doctor_id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.specialization} • {doc.email}</p>
                                </div>
                                <button onClick={() => handleDeleteDoctor(doc.doctor_id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Doctor">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Appointments */}
                <div className="card p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">All System Appointments</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {appointments.map(appt => (
                            <div key={appt.id} className="p-4 border border-gray-100 rounded-lg text-sm bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-brand-700">Dr. {appt.doctor_name}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                        ${appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                                        appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    `}>{appt.status}</span>
                                </div>
                                <p className="text-gray-600 mb-1">Patient: <span className="font-medium text-gray-900">{appt.patient_name}</span></p>
                                <p className="text-gray-500 text-xs">{appt.date} at {appt.time}</p>
                            </div>
                        ))}
                        {appointments.length === 0 && <p className="text-sm text-gray-500">No appointments in the system.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
