import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="bg-gradient-to-br from-brand-50 to-brand-100 p-2 rounded-xl shadow-sm border border-white group-hover:scale-105 transition-transform duration-300">
                                <Activity className="h-6 w-6 text-brand-600" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">HealthSync</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-5">
                        {user ? (
                            <>
                                {user.role === 'patient' && (
                                    <>
                                        <Link to="/patient" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Dashboard</Link>
                                        <Link to="/patient/book" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Book Appt</Link>
                                        <Link to="/doctors" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Doctors</Link>
                                    </>
                                )}
                                {user.role === 'doctor' && (
                                    <Link to="/doctor" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Dashboard</Link>
                                )}
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Dashboard</Link>
                                        <Link to="/doctors" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Doctors</Link>
                                    </>
                                )}
                                
                                <div className="hidden sm:flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200">
                                    <span className="text-sm text-slate-500">Welcome, <span className="font-bold text-slate-800">{user.name}</span></span>
                                    <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">Logout</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors">Sign In</Link>
                                <Link to="/register" className="btn-primary text-sm py-1.5 px-4 shadow-brand-500/30">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
