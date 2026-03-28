import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorList from './pages/DoctorList';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const RootRoute = () => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
};

function App() {
  return (
    <Router>
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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

                    {/* Shared Protected Routes (Patient and Admin can view Doctors) */}
                    <Route element={<ProtectedRoute allowedRoles={['patient', 'admin']} />}>
                        <Route path="/doctors" element={<DoctorList />} />
                    </Route>
                </Routes>
            </main>
        </div>
    </Router>
  );
}

export default App;
