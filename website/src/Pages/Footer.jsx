import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const Footer = () => {
    return (
        <footer className="text-white pt-5 pb-3" style={{ backgroundColor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="container pt-4">
                <div className="row gy-5">

                    {/* Brand Section */}
                    <div className="col-lg-4 col-md-6 pe-lg-5">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Home size={32} color="#fbbf24" strokeWidth={2.5} />
                            <span className="fs-3 fw-bolder" style={{ fontFamily: "'Inter', sans-serif", color: "white" }}>
                                Renexa<span style={{ color: '#fbbf24' }}>.ai</span>
                            </span>
                        </div>
                        <p className="text-secondary mb-4" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                            <strong className="text-white">R</strong>esidential <strong className="text-white">En</strong>gineering & <strong className="text-white">Ex</strong>pert <strong className="text-white">A</strong>greements.
                            <br /><br />
                            Your premium platform for intelligent home estimating and seamless contractor connection.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-secondary hover-yellow transition-all" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="text-secondary hover-yellow transition-all" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="text-secondary hover-yellow transition-all" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="text-secondary hover-yellow transition-all" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-4 text-white">Quick Links</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><NavLink to="/home" className="text-secondary text-decoration-none hover-white transition-all">Home</NavLink></li>
                            <li><NavLink to="/about-us" className="text-secondary text-decoration-none hover-white transition-all">About Us</NavLink></li>
                            <li><NavLink to="/services" className="text-secondary text-decoration-none hover-white transition-all">Services</NavLink></li>
                            <li><NavLink to="/contractor-dashboard" className="text-secondary text-decoration-none hover-white transition-all">Contractors</NavLink></li>
                        </ul>

                        <div className="mt-4">
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`${API_BASE_URL}/uploads/app-debug.apk`, "_blank");
                                }}
                                className="btn fw-bold px-3 py-2 text-dark w-100 shadow-sm"
                                style={{ borderRadius: '8px', backgroundColor: '#fbbf24', border: 'none', cursor: 'pointer' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-android2 me-2 mb-1" viewBox="0 0 16 16">
                                  <path d="m10.213 1.471.691-1.26c.046-.083.03-.147-.048-.192-.085-.038-.15-.019-.195.058l-.7 1.27A4.8 4.8 0 0 0 8.005.941c-.68 0-1.34.135-1.956.404l-.7-1.27C5.304 0 5.239-.019 5.154.019c-.078.045-.094.109-.048.192l.691 1.26a5.1 5.1 0 0 0-2.328 2.522h9.108a5.1 5.1 0 0 0-2.364-2.522zM8 2.541a.524.524 0 1 1 0 1.048.524.524 0 0 1 0-1.048M4.92 5.06H3.344v6.852h1.576z"/>
                                  <path d="M5.424 5.06h5.152v6.852c0 .445-.357.81-.796.81H6.22c-.44 0-.796-.365-.796-.81zM12.656 5.06h-1.576v6.852h1.576zM7.228 13.912h1.544V16H7.228z"/>
                                </svg>
                                Download Mobile App
                            </button>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-4 text-white">Our Features</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="text-secondary">AI Estimations</li>
                            <li className="text-secondary">2D Map Predictions</li>
                            <li className="text-secondary">Secure Client Chats</li>
                            <li className="text-secondary">Real-Time Tracking</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-4 text-white">Contact Us</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="d-flex align-items-center gap-3 text-secondary">
                                <MapPin size={18} color="#fbbf24" />
                                <span>123 Innovation Drive, Tech City, TC 90210</span>
                            </li>
                            <li className="d-flex align-items-center gap-3 text-secondary">
                                <Phone size={18} color="#fbbf24" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="d-flex align-items-center gap-3 text-secondary">
                                <Mail size={18} color="#fbbf24" />
                                <span>support@renexa.ai</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="row mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                            &copy; {new Date().getFullYear()} Renexa.ai. All Rights Reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
                            <a href="#" className="text-secondary text-decoration-none hover-white me-3">Privacy Policy</a>
                            <a href="#" className="text-secondary text-decoration-none hover-white">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Scoped CSS for hover effects */}
            <style>{`
                .hover-yellow:hover { color: #fbbf24 !important; }
                .hover-white:hover { color: #ffffff !important; }
                .transition-all { transition: all 0.2s ease; }
            `}</style>
        </footer>
    );
};
