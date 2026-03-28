import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Shield } from 'lucide-react';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Our Specialists</h1>
                <p className="text-gray-500 mt-1">Browse our list of available doctors.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {doctors.map(doc => (
                    <div key={doc.doctor_id} className="card p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-4 border-4 border-brand-100">
                            <User className="h-10 w-10 text-brand-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{doc.name}</h3>
                        <p className="text-brand-600 font-medium text-sm mb-3 flex items-center justify-center">
                            <Shield className="w-3 h-3 mr-1" /> {doc.specialization}
                        </p>
                        <p className="text-gray-500 text-xs mt-auto line-clamp-2">
                            Dedicated to providing excellent patient care and medical services.
                        </p>
                    </div>
                ))}
                {doctors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No doctors currently available in the system.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorList;
