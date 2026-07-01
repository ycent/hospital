import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Home, Calendar, Users, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const getLinks = () => {
        if (user.role === 'patient') {
            return [
                { name: 'Dashboard', path: '/patient', icon: Home },
                { name: 'Book Visit', path: '/patient/book', icon: Calendar },
                { name: 'Specialists', path: '/doctors', icon: Users },
            ];
        } else if (user.role === 'doctor') {
            return [
                { name: 'Dashboard', path: '/doctor', icon: Home },
            ];
        } else if (user.role === 'admin') {
            return [
                { name: 'Overview', path: '/admin', icon: Home },
                { name: 'Specialists', path: '/doctors', icon: Users },
            ];
        }
        return [];
    };

    const links = getLinks();

    const linkClass = (path) => `
        flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
        ${isActive(path)
            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
        }
    `;

    const SidebarContent = () => (
        <div className="flex flex-col h-full justify-between p-6">
            <div className="space-y-8">
                {/* Brand */}
                <Link to="/" className="flex items-center space-x-3 group px-2" onClick={() => setIsOpen(false)}>
                    <div className="bg-gradient-to-tr from-brand-500 to-teal-400 p-2 rounded-xl text-white shadow-md shadow-brand-500/10 group-hover:scale-105 transition-all">
                        <Activity className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white">
                        Health<span className="text-brand-400">Sync</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className="space-y-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={linkClass(link.path)}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Session Info & Logout */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-2">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-brand-400 font-bold border border-slate-700 shadow-sm shrink-0">
                        {user.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-bold text-slate-200 truncate">{user.name}</p>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            {user.role} Account
                        </span>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Left Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800/80 hidden md:block z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Top Bar */}
            <header className="fixed top-0 inset-x-0 h-16 bg-slate-900 border-b border-slate-800/80 flex md:hidden items-center justify-between px-6 z-40">
                <Link to="/" className="flex items-center space-x-2.5">
                    <div className="bg-brand-500 p-1.5 rounded-lg text-white">
                        <Activity className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-white">
                        Health<span className="text-brand-400">Sync</span>
                    </span>
                </Link>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-slate-400 hover:text-slate-200 p-1.5 bg-slate-800 rounded-lg"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </header>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Dark backdrop overlay */}
                    <div 
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Sliding panel */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800 shadow-2xl animate-fade-in-up duration-300">
                        <div className="absolute top-0 right-0 -mr-12 pt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-slate-800 text-slate-300"
                            >
                                <X className="h-6 h-6" />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
