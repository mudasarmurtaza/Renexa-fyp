import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import about_us from '../assets/About_Page_Pics/Image_1.JPG';
import whoweare from '../assets/About_Page_Pics/Image_2.JPG';
import ourmission from '../assets/About_Page_Pics/Image_3.JPG';
import { Target, Users, Lightbulb } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const AboutUs = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem', overflowX: 'hidden' }}>

      {/* Header Banner - Immediate display */}
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
          <span className="badge rounded-pill mb-3 px-4 py-2 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', letterSpacing: '2px', fontSize: '0.9rem' }}>Discover Renexa</span>
          <h1 className="fw-bolder text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-1px' }}>
            About Our Company
          </h1>
          <p className="fs-5 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '700px' }}>
            Transforming the construction industry through artificial intelligence, transparency, and seamless collaboration.
          </p>
        </div>
      </div>

      <main className="container">
        {/* About Us */}
        <div className="row align-items-center mb-5 pb-5 g-5">
          <div className="col-lg-6 col-md-6 col-12 pe-lg-5">
            <ScrollReveal delay={100}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
                  <Lightbulb size={24} color="#d97706" />
                </div>
                <h2 className="fw-bolder mb-0 text-dark" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: '-0.5px' }}>
                  Who We Are
                </h2>
              </div>
              <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
                We are passionate innovators dedicated to developing solutions that transform the way industries operate. Our mission is to bring lasting impact to construction by blending modern <strong className="text-dark">technology</strong>, <strong className="text-dark">expertise</strong>, and <strong className="text-dark">creativity</strong>.
              </p>
              <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
                By collaborating with clients and industry leaders, we deliver groundbreaking projects that redefine standards and open new opportunities. With a focus on sustainability and efficiency, we take pride in building solutions that make a difference.
              </p>
            </ScrollReveal>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <ScrollReveal delay={300}>
              <div className="position-relative">
                <div className="position-absolute rounded-4 d-none d-lg-block" style={{ width: '100%', height: '100%', border: '3px solid #fbbf24', top: '20px', left: '-20px', zIndex: 0 }}></div>
                <img
                  src={about_us}
                  alt="About Us"
                  className="img-fluid rounded-4 shadow position-relative"
                  style={{ height: "450px", objectFit: "cover", width: "100%", zIndex: 1, transition: "transform 0.4s ease" }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="row justify-content-center mb-5 pb-5 g-5">
          {/* Mission Card */}
          <div className="col-lg-6 col-md-12 col-12 d-flex">
            <ScrollReveal delay={100} style={{ width: '100%' }}>
              <div className="card shadow-sm border-0 w-100" style={{ borderRadius: '2rem', backgroundColor: '#ffffff', padding: 'clamp(2rem, 3vw, 3rem)' }}>
                <div className="d-flex flex-column align-items-center text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(251, 191, 36, 0.15)' }}>
                    <Target size={40} color="#d97706" />
                  </div>
                  <h2 className="fw-bolder mb-4 text-dark" style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", letterSpacing: '-0.5px' }}>
                    Our Mission
                  </h2>
                  <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
                    Our mission is to simplify complexity through technology-driven, impactful solutions. Construction shouldn't be unpredictable.
                  </p>
                  <p className="fs-5 text-secondary mb-0" style={{ lineHeight: '1.8' }}>
                    With precision, dedication, and robust AI integrations, we aim to provide streamlined approaches that empower both investors and contractors globally.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Vision Card */}
          <div className="col-lg-6 col-md-12 col-12 d-flex">
            <ScrollReveal delay={250} style={{ width: '100%' }}>
              <div className="card border-0 shadow-lg text-white w-100 overflow-hidden" style={{ borderRadius: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: 'clamp(2rem, 3vw, 3rem)' }}>
                <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', backgroundColor: 'rgba(251,191,36,0.1)', top: '-100px', left: '-100px', filter: 'blur(40px)' }}></div>
                <div className="position-absolute rounded-circle" style={{ width: '200px', height: '200px', backgroundColor: 'rgba(251,191,36,0.1)', bottom: '-50px', right: '-50px', filter: 'blur(30px)' }}></div>

                <div className="d-flex flex-column align-items-center text-center position-relative z-1 h-100">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(251, 191, 36, 0.15)', border: '2px solid rgba(251, 191, 36, 0.3)' }}>
                    <Lightbulb size={40} color="#fbbf24" />
                  </div>
                  <h2 className="fw-bolder mb-4" style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", color: '#fbbf24', letterSpacing: '-0.5px' }}>
                    Our Vision
                  </h2>
                  <p className="fs-5" style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                    We envision a future where technology bridges gaps, connects people, and opens doors to endless possibilities within the construction and engineering sector.
                  </p>
                  <p className="fs-5 mb-0" style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                    By blending human creativity with technical expertise, we will revolutionize how homes are built. Our vision embraces a smarter way of living—streamlined, interconnected, and digitally transformed.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
};
