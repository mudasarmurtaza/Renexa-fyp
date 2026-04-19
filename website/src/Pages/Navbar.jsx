import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import { User, Home, UserPlus, LogIn } from "lucide-react";

export const Navbar = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const contractorToken = localStorage.getItem("token");
            const customerToken = localStorage.getItem("customerToken");
            const token = contractorToken || customerToken;

            if (!token) {
                setAuthenticated(false);
                setUser(null);
                return;
            }

            // Decide endpoint based on which token exists
            const endpoint = contractorToken
                ? "/contractor/me"
                : "/customer/me";

            try {
                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.authenticated) {
                    setAuthenticated(true);
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    setAuthenticated(false);
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("customerToken");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();

        window.addEventListener("authChange", checkAuth);
        return () => window.removeEventListener("authChange", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("customerToken");
        localStorage.removeItem("contractor");
        localStorage.removeItem("customer");
        localStorage.removeItem("user");
        setAuthenticated(false);
        setUser(null);
        window.dispatchEvent(new Event("authChange"));
        navigate("/home");
        closeNavbar();
    };

    const closeNavbar = () => {
        const navbar = document.getElementById("navbarNav");
        if (navbar && navbar.classList.contains("show")) {
            const toggler = document.querySelector(".navbar-toggler");
            if (toggler) toggler.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
            <div className="container">
                <a className="navbar-brand text-white logo-container" href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
                    <Home className="logo-icon" size={36} color="#fbbf24" strokeWidth={2.5} />
                    <span className="logo-text">Renexa<span className="logo-dot">.ai</span></span>
                </a>

                <button
                    className="navbar-toggler custom-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav align-items-center w-100 justify-content-end gap-2">
                        <li className="nav-item">
                            <NavLink to="/home" className="nav-link custom-link" onClick={closeNavbar}>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about-us" className="nav-link custom-link" onClick={closeNavbar}>About Us</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/services" className="nav-link custom-link" onClick={closeNavbar}>Services</NavLink>
                        </li>

                        {authenticated ? (
                            <li className="nav-item">
                                <NavLink onClick={handleLogout} className="nav-link custom-link" to="#">
                                    Logout
                                </NavLink>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle custom-link d-flex align-items-center gap-1"
                                        href="#"
                                        id="registerDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <UserPlus size={18} /> Register
                                    </a>
                                    <ul
                                        className="dropdown-menu custom-dropdown-menu"
                                        aria-labelledby="registerDropdown"
                                    >
                                        <li>
                                            <NavLink to="/customer-signup" className="dropdown-item custom-dropdown-item" onClick={closeNavbar}>
                                                As Customer
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/contractor-signup" className="dropdown-item custom-dropdown-item" onClick={closeNavbar}>
                                                As Contractor
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle custom-link d-flex align-items-center gap-1"
                                        href="#"
                                        id="loginDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <LogIn size={18} /> Login
                                    </a>
                                    <ul
                                        className="dropdown-menu custom-dropdown-menu"
                                        aria-labelledby="loginDropdown"
                                    >
                                        <li>
                                            <NavLink to="/customer-login" className="dropdown-item custom-dropdown-item" onClick={closeNavbar}>
                                                As  Customer
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/contractor-login" className="dropdown-item custom-dropdown-item" onClick={closeNavbar}>
                                                As Contractor
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}

                        {/* <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                            <NavLink to="/contractor-dashboard" className="premium-btn text-decoration-none d-inline-block">
                                Learn More
                            </NavLink>
                        </li> */}

                        {authenticated && (
                            <li className="nav-item ms-lg-2 mt-3 mt-lg-0 list-unstyled">
                                <NavLink
                                    to={localStorage.getItem("token") ? "/contractor-profile" : "/customer-profile"}
                                    onClick={closeNavbar}
                                    className="profile-btn text-decoration-none d-flex align-items-center justify-content-center p-0"
                                    style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid #fbbf24" }}
                                >
                                    {user?.profilePic ? (
                                        <img src={`${user.profilePic}`} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <User size={22} className="text-white" />
                                    )}
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
