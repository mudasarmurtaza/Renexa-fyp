import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import image1 from '../assets/Services_Page_Pics/image1.JPG';
import bg_Funfact from '../assets/Services_Page_Pics/bg-funfact.png';
import funfact1 from '../assets/Services_Page_Pics/Funfact1.png';
import funfact2 from '../assets/Services_Page_Pics/Funfact2.png';
import funfact3 from '../assets/Services_Page_Pics/Funfact3.png';
import { Calculator, Package, Map, Users, MessageSquare, LineChart } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(end);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

// Scroll Reveal Wrapper Component
const ScrollReveal = ({ children, delay = 0, style = {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Unobserve once animated
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into full view
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Provide inline animation properties combined with the dynamic state
  const revealStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms`,
    ...style
  };

  return (
    <div ref={ref} style={revealStyle}>
      {children}
    </div>
  );
};


export const Services = () => {
  return (
    <div id="services" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem', overflowX: 'hidden' }}>

      {/* Header Banner - immediate display */}
      <div className="text-center py-5 mb-5" style={{ backgroundColor: '#0f172a', borderBottom: '4px solid #fbbf24', animation: 'fadeIn 1s ease-out' }}>
        <style>
          {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}
        </style>
        <div className="container py-5 mt-4">
          <span className="badge rounded-pill mb-3 px-4 py-2 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', letterSpacing: '2px', fontSize: '0.9rem' }}>What We Do</span>
          <h1 className="fw-bolder text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-1px' }}>
            Our Services
          </h1>
          <p className="fs-5 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '700px' }}>
            Providing intelligent, efficient tools to simplify house construction planning and budget management.
          </p>
        </div>
      </div>

      <main className="container">
        {/* Introduction Section */}
        <div className="row align-items-center mb-5 pb-5 g-5">
          <div className="col-lg-6 col-md-6 col-12 pe-lg-5">
            <ScrollReveal delay={100}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <h2 className="fw-bolder mb-0 text-dark" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: '-0.5px' }}>
                  Build Smarter.
                </h2>
              </div>
              <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
                We provide intelligent, efficient, and user-friendly tools designed to bring predictability and clarity to your building projects.
              </p>
              <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
                Our suite of services aims to save time, reduce financial overhead, and ensure seamless collaboration from initial design down to final estimation.
              </p>
              <button className="btn rounded-pill px-4 py-2 fw-medium mt-3" style={{ backgroundColor: "#fbbf24", color: "#0f172a", border: '2px solid #fbbf24', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fbbf24'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fbbf24'; e.currentTarget.style.color = '#0f172a'; }}>
                Explore Platform
              </button>
            </ScrollReveal>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <ScrollReveal delay={300}>
              <div className="position-relative w-100">
                <div className="position-absolute rounded-4 d-none d-lg-block" style={{ width: '100%', height: '100%', border: '3px solid #fbbf24', top: '20px', left: '-20px', zIndex: 0 }}></div>
                <img
                  src={image1}
                  alt="Construction Services"
                  className="img-fluid rounded-4 shadow position-relative"
                  style={{ height: "450px", objectFit: "cover", width: "100%", zIndex: 1, transition: "transform 0.4s ease" }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Fun Facts Section Banner */}
        <ScrollReveal delay={100}>
          <div className="card shadow-lg text-white mb-5 overflow-hidden position-relative" style={{ borderRadius: '2rem', minHeight: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="position-absolute w-100 h-100" style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url(${bg_Funfact})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0
            }}></div>

            <div className="card-body p-5 p-md-5 d-flex flex-column justify-content-center position-relative z-1">
              <div className="text-center mb-5">
                <span className="badge rounded-pill mb-3 px-4 py-2 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', letterSpacing: '2px', fontSize: '0.9rem' }}>Milestones</span>
                <h2 className="fw-bolder mb-0 text-white" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: '-0.5px' }}>
                  Our Fun Facts
                </h2>
              </div>

              <div className="row g-5 justify-content-center">
                {/* Funfact 1 */}
                <div className="col-lg-3 col-md-4 col-12 d-flex flex-column align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-4 overflow-hidden shadow" style={{ width: '120px', height: '120px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <img src={funfact1} alt="Satisfied Clients" className="img-fluid" style={{ width: "65px", objectFit: "contain", opacity: 0.9 }} />
                  </div>
                  <h2 className="fw-bolder text-white mb-1" style={{ fontSize: '3rem', color: '#fbbf24' }}>
                    <AnimatedCounter end={15} suffix="+" />
                  </h2>
                  <p className="text-white-50 fs-5 mb-0 fw-medium">Satisfied Clients</p>
                </div>

                {/* Funfact 2 */}
                <div className="col-lg-3 col-md-4 col-12 d-flex flex-column align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-4 overflow-hidden shadow" style={{ width: '120px', height: '120px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <img src={funfact2} alt="Awards Achieved" className="img-fluid" style={{ width: "65px", objectFit: "contain", opacity: 0.9 }} />
                  </div>
                  <h2 className="fw-bolder text-white mb-1" style={{ fontSize: '3rem', color: '#fbbf24' }}>
                    <AnimatedCounter end={10} suffix="+" />
                  </h2>
                  <p className="text-white-50 fs-5 mb-0 fw-medium">Awards Achieved</p>
                </div>

                {/* Funfact 3 */}
                <div className="col-lg-3 col-md-4 col-12 d-flex flex-column align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-4 overflow-hidden shadow" style={{ width: '120px', height: '120px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <img src={funfact3} alt="Team Members" className="img-fluid" style={{ width: "65px", objectFit: "contain", opacity: 0.9 }} />
                  </div>
                  <h2 className="fw-bolder text-white mb-1" style={{ fontSize: '3rem', color: '#fbbf24' }}>
                    <AnimatedCounter end={3} suffix="" />
                  </h2>
                  <p className="text-white-50 fs-5 mb-0 fw-medium">Team Members</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <ScrollReveal delay={100}>
          <div className="text-center mb-5 pb-3 mt-5 pt-4">
            <h2 className="fw-bolder" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#0f172a' }}>
              Platform Capabilities
            </h2>
          </div>
        </ScrollReveal>

        <div className="row g-4 justify-content-center mb-5 pb-5 w-100 mx-auto">
          {[
            { title: "Cost Estimation", desc: "Get accurate cost estimates instantly by entering basic project details. Our AI system calculates total budget with precision.", icon: Calculator },
            { title: "Material Planning", desc: "Receive a detailed breakdown of materials based on your specifications, helping you avoid wastage and ensure optimal allocation.", icon: Package },
            { title: "Floor Plan Design", desc: "Visualize your dream home with our easy-to-use floor plan designer. Create custom layouts and adjust room sizes effortlessly.", icon: Map },
            { title: "Builder Matching", desc: "Connect with verified contractors in your area. Browse reviews and past projects to select the right professional.", icon: Users },
            { title: "Secure Collaboration", desc: "Communicate directly with contractors through our built-in secure messaging. Share drawings and track updates.", icon: MessageSquare },
            { title: "Budget Tracking", desc: "Track expenses in real-time and compare against your planned budget. Avoid unexpected overruns with smart alerts.", icon: LineChart },
          ].map((service, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
              {/* Staggered delay based on index for a neat domino effect */}
              <ScrollReveal delay={index * 150} style={{ width: '100%' }}>
                <div className="card h-100 position-relative w-100" style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.5rem',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'default',
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
                  <div className="position-absolute top-0 start-0 w-100" style={{ height: '6px', background: 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}></div>

                  <div className="card-body p-4 p-md-5 d-flex flex-column">
                    <div className="mb-4 rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{
                      width: '70px', height: '70px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid rgba(0,0,0,0.03)'
                    }}>
                      <service.icon size={32} color="#fbbf24" strokeWidth={2} />
                    </div>
                    <h4 className="fw-bolder text-dark mb-3" style={{ fontSize: '1.3rem', letterSpacing: '-0.5px' }}>{service.title}</h4>
                    <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.7' }}>{service.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
