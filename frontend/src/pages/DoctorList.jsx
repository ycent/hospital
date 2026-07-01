import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/doctors');
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Our Specialists</h1>
                    <p className="text-slate-500 text-sm">Browse our list of certified clinic doctors and specialists.</p>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {doctors.map(doc => (
                    <div key={doc.doctor_id} className="card-interactive p-6 flex flex-col items-center text-center relative overflow-hidden bg-white/80 border-slate-100/50">
                        {/* Diagonal Accent Stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-teal-400"></div>

                        <div className="w-20 h-20 bg-gradient-to-tr from-brand-50 to-brand-100/60 rounded-3xl flex items-center justify-center mb-5 border border-brand-100 shadow-inner text-brand-600">
                            <User className="h-10 w-10" />
                        </div>
                        
                        <h3 className="font-extrabold text-slate-800 text-lg mb-1">Dr. {doc.name}</h3>
                        
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 border border-brand-500/10 mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {doc.specialization}
                        </span>

                        <div className="w-full border-t border-slate-100/80 pt-4 mt-auto flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="text-xs font-bold truncate max-w-[180px]">{doc.email}</span>
                        </div>
                    </div>
                ))}
                
                {doctors.length === 0 && (
                    <div className="col-span-full py-16 text-center card border-dashed border-2 border-slate-200 bg-white/40 flex flex-col items-center justify-center">
                        <User className="h-12 w-12 text-slate-300 mb-4 animate-pulse-slow" />
                        <h3 className="text-base font-bold text-slate-700">No doctors currently registered</h3>
                        <p className="text-xs text-slate-500 mt-1">Please log in as an administrator to add doctors to the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorList;
