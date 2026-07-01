import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return null;
    
    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
        return <Navigate to="/patient" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login(email, password);
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'doctor') navigate('/doctor');
            else navigate('/patient');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[75vh] py-8">
            {/* Ambient Background Glows */}
            <div className="absolute -z-10 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
            <div className="absolute -z-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

            <div className="w-full max-w-md card p-8 sm:p-10 animate-fade-in-up border border-slate-100 shadow-xl shadow-brand-500/5">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-gradient-to-tr from-brand-600 to-teal-400 p-3.5 rounded-2xl mb-4 shadow-lg shadow-brand-500/20 text-white">
                        <Activity className="h-7 w-7" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-slate-500 text-sm font-medium">Please sign in to access your HealthSync account</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200/50 text-rose-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                required
                                className="input-field pl-11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                required
                                className="input-field pl-11"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full flex items-center justify-center py-3.5">
                            Sign In <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline transition-all">
                        Create Patient Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
