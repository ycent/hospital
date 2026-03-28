import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) return null;
    
    // Redirect if already logged in
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
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md card p-8 sm:p-10 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-gradient-to-br from-brand-50 to-brand-100 p-3 rounded-2xl mb-5 shadow-sm border border-white">
                        <Activity className="h-8 w-8 text-brand-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-slate-500 text-sm">Please sign in to your primary account</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                            Email address
                        </label>
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                            Password
                        </label>
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
                            Sign In
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                        Create one as a Patient
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
