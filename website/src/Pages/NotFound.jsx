import React from "react";
import { NavLink } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-4">
            <div className="text-center" style={{ maxWidth: '500px' }}>
                <div className="mb-4 d-inline-block p-4 bg-warning bg-opacity-10 rounded-circle">
                    <AlertTriangle size={64} className="text-warning animate-bounce" />
                </div>
                <h1 className="display-3 fw-bold text-dark mb-2">404</h1>
                <h2 className="h4 fw-bold text-secondary mb-4">Page Not Found</h2>
                <p className="text-muted mb-5 shadow-sm p-3 bg-white rounded border border-warning" style={{ borderLeftWidth: '5px !important' }}>
                    Oops! The page or resource you're looking for doesn't exist or is currently unavailable.
                    <br />
                    <small className="text-secondary mt-2 d-block">
                        <strong>Note:</strong> If you were trying to download the <strong>Mobile App</strong>, the APK might still be in the building process or not yet uploaded to the server. Please try again in few minutes.
                    </small>
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <NavLink
                        to="/home"
                        className="btn btn-warning fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                        style={{ borderRadius: '8px' }}
                    >
                        <Home size={18} />
                        Back to Home
                    </NavLink>
                </div>
            </div>

            <style>{`
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default NotFound;
