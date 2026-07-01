import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
        ${isActive(path) 
            ? 'bg-brand-500/10 text-brand-600 shadow-sm border border-brand-500/10' 
            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
        }
    `;

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_15px_rgba(0,0,0,0.01)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2.5 group">
                            <div className="bg-gradient-to-tr from-brand-600 to-teal-400 p-2 rounded-xl shadow-md text-white group-hover:scale-105 transition-all duration-300 group-hover:rotate-6">
                                <Activity className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                                Health<span className="text-brand-500">Sync</span>
                            </span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    {user.role === 'patient' && (
                                        <>
                                            <Link to="/patient" className={navLinkClass('/patient')}>Dashboard</Link>
                                            <Link to="/patient/book" className={navLinkClass('/patient/book')}>Book Visit</Link>
                                            <Link to="/doctors" className={navLinkClass('/doctors')}>Specialists</Link>
                                        </>
                                    )}
                                    {user.role === 'doctor' && (
                                        <Link to="/doctor" className={navLinkClass('/doctor')}>Dashboard</Link>
                                    )}
                                    {user.role === 'admin' && (
                                        <>
                                            <Link to="/admin" className={navLinkClass('/admin')}>Overview</Link>
                                            <Link to="/doctors" className={navLinkClass('/doctors')}>Specialists</Link>
                                        </>
                                    )}
                                </div>
                                
                                <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-slate-200">
                                    <div className="hidden md:flex flex-col text-right">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Welcome</span>
                                        <span className="text-xs font-bold text-slate-800 flex items-center">
                                            <UserIcon className="w-3 h-3 mr-1 text-slate-400" /> {user.name}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-brand-600 font-semibold transition-colors text-sm px-3 py-2">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4 shadow-md">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
