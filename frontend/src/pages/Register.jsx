import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, User as UserIcon, Mail, Lock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return null;
    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, 'patient');
            navigate('/patient');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden card border-slate-200/60 shadow-2xl shadow-brand-500/5 bg-white/70 backdrop-blur-xl">
                
                {/* Left Side: Form */}
                <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white/40">
                    <div className="max-w-md w-full mx-auto space-y-7">
                        <div className="space-y-2">
                            <div className="lg:hidden bg-gradient-to-tr from-brand-600 to-teal-400 p-2.5 rounded-xl w-fit text-white mb-4 shadow-md">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                            <p className="text-slate-500 text-sm font-semibold">Join HealthSync as a new patient</p>
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-200/50 text-rose-600 px-4 py-3.5 rounded-xl text-sm font-semibold flex items-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="input-field pl-11"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                                    Email address
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

                            <button type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center text-sm shadow-md">
                                Register Account <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </form>

                        <div className="border-t border-slate-100 pt-6 text-center text-sm font-semibold text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-600 hover:text-brand-500 hover:underline transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Marketing/Visual Showcase */}
                <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800">
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl translate-y-12 -translate-x-12 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-brand-400" />
                            <span className="font-extrabold text-sm tracking-wider uppercase">HealthSync Pro</span>
                        </div>
                        <div className="space-y-4 pt-10">
                            <p className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-100">
                                "The onboarding was effortless and patient check-ups became 2x faster."
                            </p>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-400">CE</div>
                                <div>
                                    <p className="text-xs font-bold text-slate-200">Dr. Clara Evans</p>
                                    <p className="text-[10px] font-semibold text-slate-400">Chief Pediatrician</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 space-y-4">
                        <div className="flex items-center text-xs font-bold text-slate-300">
                            <ShieldCheck className="w-4 h-4 mr-2.5 text-brand-400 shrink-0" /> Verified Medical Roster
                        </div>
                        <div className="flex items-center text-xs font-bold text-slate-300">
                            <Heart className="w-4 h-4 mr-2.5 text-brand-400 shrink-0" /> Double-Booking Blockers
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
