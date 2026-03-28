import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return null;
    if (user) return <Navigate to="/" replace />; // Let RootRoute handle correct redirect

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, 'patient');
            navigate('/patient');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md card p-8 sm:p-10 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-gradient-to-br from-brand-50 to-brand-100 p-3 rounded-2xl mb-5 shadow-sm border border-white">
                        <Activity className="h-8 w-8 text-brand-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h2>
                    <p className="text-slate-500 text-sm">Join as a new patient</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">Email address</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full shadow-brand-500/40">
                            Create Account
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
