import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Typewriter } from 'react-simple-typewriter';

import bgImage from '../assets/Home_Page_Pics/orig.jpeg';
import howitworks from '../assets/Home_Page_Pics/How_it_works.JPG'

// feature images
import AIestimation from '../assets/Home_Page_Pics/Image_AI_Est.png'
import D_Map from '../assets/Home_Page_Pics/Image_2D_Map.png'
import SecureChat from '../assets/Home_Page_Pics/Secure_Chat.png'
import ContactRating from '../assets/Home_Page_Pics/Contractor_Rating.png'
import RealTime from '../assets/Home_Page_Pics/Real_Time.png'
import { FaCircleCheck } from "react-icons/fa6";
import { ClipboardList, Calculator, Receipt, Handshake, CheckCircle2 } from 'lucide-react';

const backgroundImages = [
    bgImage,
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
];

export const Home = () => {
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prevBg) => (prevBg + 1) % backgroundImages.length);
        }, 3000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section
                className="text-white d-flex align-items-center position-relative"
                style={{
                    minHeight: "100vh",
                    overflow: "hidden"
                }}
            >
                {/* Background Carousel */}
                {backgroundImages.map((img, index) => (
                    <div
                        key={index}
                        className="position-absolute w-100 h-100"
                        style={{
                            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.4)), url(${img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: index === currentBg ? 1 : 0,
                            transition: "opacity 1.5s ease-in-out",
                            zIndex: -1,
                            top: 0,
                            left: 0
                        }}
                    />
                ))}

                <div className="container text-center pt-5 mt-5">
                    <h1 className="fw-bolder mb-4"
                        style={{
                            fontSize: "clamp(2.5rem, 6vw, 80px)", // responsive scaling
                            fontWeight: 800,
                            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            minHeight: "120px", // prevent layout shift when typing
                            color: "#ffffff"
                        }}
                    >
                        <span style={{ color: '#ffffff' }}>
                            <Typewriter style={{ color: '#ffffff' }}
                                words={[
                                    'Estimate Your Dream Home',
                                    'Find the Best Contractors',
                                    'Get Accurate Project Bids',
                                ]}
                                loop={true}
                                cursor
                                cursorStyle='_'
                                typeSpeed={60}
                                deleteSpeed={40}

                                delaySpeed={2000}

                            />
                        </span>
                    </h1>

                    <p className="fs-4 mb-5 mx-auto" style={{ maxWidth: "800px", color: "rgba(255,255,255,0.9)" }}>
                        Renexa.ai is your premium platform for intelligent home estimating and seamless contractor connection.
                    </p>

                    <button
                        className="btn px-5 py-3 fs-5 rounded-pill fw-bold shadow-lg"
                        style={{
                            background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                            color: "#0f172a",
                            border: "none",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-3px)";
                            e.target.style.boxShadow = "0 10px 25px rgba(251, 191, 36, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 0.5rem 1rem rgba(0, 0, 0, 0.15)";
                        }}
                    >
                        Get Started Now
                    </button>
                </div>
            </section>

            {/* How it Works */}
            <section className="container-fluid py-5" style={{ backgroundColor: '#f8fafc' }}>
                <div className="container py-4">
                    <div className="text-center mb-5 pb-2">
                        <span className="badge rounded-pill mb-2 px-3 py-2" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#d97706', fontSize: '0.85rem' }}>Simple Process</span>
                        <h2 className="fw-bolder" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#0f172a' }}>
                            How it Works
                        </h2>
                        <p className="text-muted fs-6 mt-2 max-w-2xl mx-auto px-3">Get your home estimation and connect with top-rated contractors in five easy steps.</p>
                    </div>

                    <div className="row align-items-center gy-4 gy-lg-0">
                        <div className="col-lg-6 col-12 order-2 order-lg-1">
                            <div className="d-flex flex-column gap-3 gap-md-4 pe-lg-4">
                                {[
                                    { icon: ClipboardList, title: "Input Requirements", desc: "Share details about your dream home project, blueprints, and preferences." },
                                    { icon: Calculator, title: "Get Estimations", desc: "Our AI analyzes your input to provide highly accurate cost and timeline estimates." },
                                    { icon: Receipt, title: "Receive Bids", desc: "Top-rated contractors review your project and submit competitive bids." },
                                    { icon: Handshake, title: "Finalize Contractor", desc: "Compare bids, read reviews, chat securely, and choose the right contractor." },
                                    { icon: CheckCircle2, title: "Get Results", desc: "Track progress in real-time and see your dream home become a reality." }
                                ].map((step, index) => (
                                    <div key={index} className="d-flex align-items-start gap-3 p-3 p-md-4 rounded-4 shadow-sm" style={{ backgroundColor: '#ffffff', transition: 'all 0.3s ease', cursor: 'default' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.borderColor = '#fbbf24';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                    >
                                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(251, 191, 36, 0.15)' }}>
                                            <step.icon size={22} color="#d97706" />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1 text-dark fs-6 fs-md-5">{step.title}</h5>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-6 col-12 order-1 order-lg-2 mb-4 mb-lg-0 text-center">
                            <div className="position-relative px-3 px-md-0">
                                {/* Decorative background element */}
                                <div className="position-absolute rounded-circle d-none d-md-block" style={{
                                    width: '70%', height: '70%',
                                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                                    top: '15%', right: '15%', zIndex: 0,
                                    filter: 'blur(50px)'
                                }}></div>

                                <img
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Architecture Planning HD"
                                    className="img-fluid rounded-4 shadow-lg position-relative"
                                    style={{ height: "clamp(300px, 50vh, 600px)", objectFit: "cover", width: "100%", zIndex: 1, border: "4px solid white" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container py-5 my-5">
                <div className="text-center mb-5 pb-4">
                    <span className="badge rounded-pill mb-3 px-4 py-2 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#d97706', letterSpacing: '2px', fontSize: '0.9rem' }}>Core Capabilities</span>
                    <h2 className="fw-bolder mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', color: '#0f172a', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        Premium Platform Features
                    </h2>
                    <p className="text-muted fs-5 max-w-2xl mx-auto px-3">Everything you need to plan, estimate, and execute your construction project successfully with powerful AI tools.</p>
                </div>

                <div className="row text-center g-4 justify-content-center px-2 px-md-0">
                    {[
                        { title: "AI Estimations", desc: "Get highly accurate project costs and breakdowns using our advanced machine learning models designed for the construction industry.", img: AIestimation },
                        { title: "2D Map Prediction", desc: "Generate intelligent 2D floor plans directly from your project requirements and spatial specifications.", img: D_Map },
                        { title: "Secure Chats", desc: "Communicate safely with contractors through our fully encrypted, built-in, real-time messaging platform.", img: SecureChat },
                        { title: "Contractor Rating", desc: "Make informed decisions based on verified peer reviews, project outcomes, and comprehensive performance history.", img: ContactRating },
                        { title: "Real-Time Tracking", desc: "Monitor your project milestones, financial payments, and overall construction progress in real-time.", img: RealTime },
                        { title: "Media Uploads", desc: "Seamlessly share CAD blueprints, site photos, and necessary legal documents securely in one central hub.", img: "https://img.icons8.com/color/96/upload--v1.png" },
                    ].map((feature, i) => (
                        <div key={i} className="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
                            <div className="card h-100 position-relative" style={{
                                backgroundColor: '#ffffff',
                                width: '100%',
                                borderRadius: '1.5rem',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-12px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 191, 36, 0.15)';
                                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                                }}
                            >
                                {/* Decorative top border */}
                                <div className="position-absolute top-0 start-0 w-100" style={{ height: '6px', background: 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}></div>

                                <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center mt-3">
                                    <div className="mb-4 rounded-circle d-flex align-items-center justify-content-center" style={{
                                        width: '110px', height: '110px',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
                                        border: '1px solid rgba(0,0,0,0.03)'
                                    }}>
                                        <img
                                            src={feature.img}
                                            alt={feature.title}
                                            className="img-fluid position-relative z-1"
                                            style={{ height: "70px", objectFit: "contain", transition: "transform 0.3s ease" }}
                                            onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                                            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                        />
                                    </div>
                                    <h4 className="fw-bolder text-dark mb-3" style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>{feature.title}</h4>
                                    <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>{feature.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            {/* <section className="container-fluid" style={{ backgroundColor: '#0f172a', color: 'white' }}>
                <section className="container py-5">
                    <h2 className="text-center fw-bolder mb-5 mt-5" style={{ fontSize: '3rem' }}>Why Choose Us</h2>
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-12 text-center mb-4 mb-lg-0 p-4">
                            <img
                                src={howitworks}
                                alt="How it Works"
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ height: "500px", objectFit: "cover", width: "100%", border: "4px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>
                        <div className="col-lg-5 col-12 mx-lg-5">
                            <ul className="list-unstyled fs-4">
                                <li className="mb-4 fw-medium d-flex align-items-center gap-3">
                                    <FaCircleCheck size={30} color="#fbbf24" /> AI-Powered Results
                                </li>
                                <li className="mb-4 fw-medium d-flex align-items-center gap-3">
                                    <FaCircleCheck size={30} color="#fbbf24" /> Verified Contractors
                                </li>
                                <li className="mb-4 fw-medium d-flex align-items-center gap-3">
                                    <FaCircleCheck size={30} color="#fbbf24" /> Transparent Bidding System
                                </li>
                                <li className="mb-4 fw-medium d-flex align-items-center gap-3">
                                    <FaCircleCheck size={30} color="#fbbf24" /> Fast & Secure Communication
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </section> */}
        </div>
    );
};
