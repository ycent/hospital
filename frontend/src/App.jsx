import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorList from './pages/DoctorList';

const RootRoute = () => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return null;
    
    // Redirect logged-in users to dashboards, else render Landing page
    if (!user) return <Landing />;
    
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
};

const AppLayout = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    // Logged Out Layout: Top glass Navbar + Main content
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50 to-teal-50">
                <Navbar />
                <main className="flex-grow flex flex-col">
                    {children}
                </main>
            </div>
        );
    }

    // Logged In Layout: Left sidebar (desktop) + top header (mobile) + main content (right side)
    return (
        <div className="min-h-screen flex bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="flex-grow flex flex-col min-h-screen md:pl-64">
                {/* Mobile top spacer */}
                <div className="h-16 md:hidden"></div>
                <main className="flex-grow p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
  return (
    <Router>
        <AppLayout>
            <Routes>
                <Route path="/" element={<RootRoute />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Patient Routes */}
                <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                    <Route path="/patient" element={<PatientDashboard />} />
                    <Route path="/patient/book" element={<BookAppointment />} />
                </Route>

                {/* Doctor Routes */}
                <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                    <Route path="/doctor" element={<DoctorDashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Shared Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['patient', 'admin']} />}>
                    <Route path="/doctors" element={<DoctorList />} />
                </Route>
            </Routes>
        </AppLayout>
    </Router>
  );
}

export default App;
