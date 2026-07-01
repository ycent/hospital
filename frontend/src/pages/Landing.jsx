import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, ShieldCheck, HeartPulse, Sparkles, User, ChevronDown, Check, ArrowRight, ShieldAlert, Award, Clock } from 'lucide-react';

const Landing = () => {
    const [faqOpen, setFaqOpen] = useState([false, false, false]);

    const toggleFaq = (index) => {
        const updated = [...faqOpen];
        updated[index] = !updated[index];
        setFaqOpen(updated);
    };

    const trustLogos = [
        "Apex Clinic", "Vanguard Health", "Saint Jude Medical", "Summit Care", "Beacon Hospital"
    ];

    const faqs = [
        {
            q: "How does the double-booking check work?",
            a: "Our smart scheduling engine cross-references the doctor's existing schedule in real-time. If another patient has already booked the same specialist for that specific date and time slot, the system blocks the request and notifies you instantly."
        },
        {
            q: "Can I cancel my appointment after scheduling it?",
            a: "Yes. Patients can cancel their appointments directly from their dashboard. Doing so changes the status to 'Cancelled' in the records, freeing up the doctor's slot for other patients."
        },
        {
            q: "How do doctors update my appointment status?",
            a: "Doctors have a private dashboard console. Once a visit is complete, they can mark it as 'Completed' or 'Cancelled', which automatically syncs with your history log."
        }
    ];

    return (
        <div className="w-full space-y-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden animate-fade-in-up">
            
            {/* 1. Hero Section */}
            <section className="text-center space-y-8 relative">
                {/* Glowing Aura Blob */}
                <div className="absolute -z-10 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>

                <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                    <span>Next-Gen Clinic Management Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-none">
                    Smart Healthcare Scheduling, <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Simplified.</span>
                </h1>
                
                <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                    Empower patients, optimize doctor rosters, and streamline clinic operations with an unified, secure scheduling platform.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                    <Link to="/register" className="btn-primary flex items-center justify-center w-full sm:w-auto px-8 py-4 shadow-xl">
                        Schedule Consultation <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link to="/login" className="btn-secondary flex items-center justify-center w-full sm:w-auto px-8 py-4 border-slate-200">
                        Specialist Roster
                    </Link>
                </div>

                {/* Simulated Dashboard UI Frame */}
                <div className="pt-12 max-w-4xl mx-auto">
                    <div className="card p-4 sm:p-6 border-slate-200/60 shadow-2xl shadow-brand-500/5 bg-white/70 backdrop-blur-xl relative">
                        {/* Title bar decoration */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <div className="flex space-x-1.5">
                                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">healthsync-console-v1</span>
                        </div>
                        
                        {/* Mock UI Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Visit</p>
                                <p className="font-bold text-slate-800 text-base mt-1">Dr. Alice Smith</p>
                                <span className="inline-block mt-2 badge-scheduled text-[10px]">Scheduled</span>
                            </div>
                            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-bold">Specialization</p>
                                <p className="font-bold text-slate-800 text-base mt-1">Cardiology Department</p>
                                <span className="inline-block mt-2 text-xs font-semibold text-brand-600">Level 4 Clinic</span>
                            </div>
                            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Slot</p>
                                <p className="font-bold text-slate-800 text-base mt-1">Tomorrow, 10:00 AM</p>
                                <span className="inline-block mt-2 text-xs text-slate-500 font-semibold">Duration: 30 mins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Trust Logos / Social Proof */}
            <section className="text-center space-y-4">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Trusted by leading medical groups</p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50">
                    {trustLogos.map((logo) => (
                        <span key={logo} className="font-extrabold text-slate-600 text-base sm:text-lg tracking-tight">
                            {logo}
                        </span>
                    ))}
                </div>
            </section>

            {/* 3. Product Features Grid */}
            <section className="space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Features Built for Healthcare</h2>
                    <p className="text-slate-500 text-sm font-medium">Streamlined access controls and database checking for a flawless schedule flow.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="card p-8 border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl w-fit border border-brand-100/50 mb-6">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3">For Patients</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Create profiles, browse medical experts, view availability dates, and schedule visits. Receive automated double-booking validation alerts instantly.
                        </p>
                    </div>

                    <div className="card p-8 border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl w-fit border border-teal-100/50 mb-6">
                            <HeartPulse className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3">For Specialists</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Access your schedule logs. Mark visits as 'Completed' or 'Cancelled' in one-click. Maintain full authority over patient check-up approvals.
                        </p>
                    </div>

                    <div className="card p-8 border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit border border-indigo-100/50 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3">For Administrators</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Add and remove doctors, assign specializations, monitor logs, and view aggregate counts of consultations in real-time.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Stepper Section */}
            <section className="card p-10 bg-slate-900 text-slate-100 border-slate-800 shadow-xl space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">How it works</span>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Three Steps to Appointment Success</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3 relative">
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">1</div>
                        <h4 className="font-bold text-lg text-white">Create Patient Account</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Sign up instantly. Enter your name, email, and password to establish your secure clinic record.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">2</div>
                        <h4 className="font-bold text-lg text-white">Select Doctor & Time</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Browse specialized cardiologists, neurologists, and pediatricians. Pick a date and time that fits your day.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">3</div>
                        <h4 className="font-bold text-lg text-white">Confirm Booking</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Our database verifies slots to eliminate scheduling conflicts. Confirm and check status logs from your hub dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. FAQs Accordion */}
            <section className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-slate-500 text-sm">Find answers to quick questions about clinic booking rules.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="card p-6 border-slate-100 shadow-sm">
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex justify-between items-center text-left focus:outline-none"
                            >
                                <span className="font-bold text-slate-800 text-base sm:text-lg">{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${faqOpen[idx] ? 'rotate-180' : ''}`} />
                            </button>
                            {faqOpen[idx] && (
                                <p className="mt-4 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                    {faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="border-t border-slate-200/60 pt-10 text-slate-500 text-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-8">
                    <div className="flex items-center space-x-2.5">
                        <Activity className="h-5 w-5 text-brand-600" />
                        <span className="text-base font-extrabold text-slate-800">
                            Health<span className="text-brand-500">Sync</span>
                        </span>
                    </div>
                    <div className="flex space-x-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <a href="#" className="hover:text-brand-600 transition-colors">Features</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Support</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
                    </div>
                </div>
                <div className="text-center sm:text-left text-xs text-slate-400 border-t border-slate-100 pt-6">
                    © {new Date().getFullYear()} HealthSync Technologies Inc. All rights reserved. Registered medical software platform.
                </div>
            </footer>
            
        </div>
    );
};

export default Landing;
