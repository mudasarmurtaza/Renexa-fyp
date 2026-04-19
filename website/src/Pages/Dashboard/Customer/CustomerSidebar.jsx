import {
  House,
  User,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Map,
  Users,
} from "lucide-react";
import { FileText } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router";
import React from "react";

/* Sidebar Component */
export const CustomerSidebar = ({ showSidebar, setShowSidebar, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("contractor");
    localStorage.removeItem("customer");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    navigate("/home");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="d-none d-lg-flex flex-column text-white p-4"
        style={{
          width: collapsed ? "70px" : "240px",
          backgroundColor: "#253863",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          transition: "width 0.3s ease",
        }}
      >
        <ToggleButton collapsed={collapsed} setCollapsed={setCollapsed} />
        <SidebarContent handleLogout={handleLogout} collapsed={collapsed} setShowSidebar={setShowSidebar} />
      </aside>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <aside
          className="d-lg-none d-flex flex-column text-white p-4"
          style={{
            width: 240,
            backgroundColor: "#253863",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1100,
            transition: "all 0.3s ease",
            boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
          }}
        >
          <div
            onClick={() => setShowSidebar(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "24px",
              width: "30px",
              height: "30px",
              background: "#ef4444",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            <X size={16} color="#ffffff" />
          </div>
          <SidebarContent handleLogout={handleLogout} collapsed={false} setShowSidebar={setShowSidebar} />
        </aside>
      )}
    </>
  );
};

/* Toggle Button */
const ToggleButton = ({ collapsed, setCollapsed }) => (
  <div
    onClick={() => setCollapsed(!collapsed)}
    style={{
      position: "absolute",
      top: "20px",
      right: "6px",
      width: "30px",
      height: "30px",
      background: "#fbbf24",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease",
      zIndex: 20,
    }}
  >
    {collapsed ? <ChevronRight size={16} color="#253863" /> : <ChevronLeft size={16} color="#253863" />}
  </div>
);

/* Sidebar Content */
const SidebarContent = ({ handleLogout, collapsed, setShowSidebar }) => (
  <>
    <div className="mb-5">
      {!collapsed && (
        <>
          <h5 className="fw-bold mb-0 text-white">
            Renexa<span style={{ color: "#fbbf24" }}>.AI</span>
          </h5>
          <small style={{ color: "rgba(255,255,255,0.6)" }}>Smart Construction</small>
        </>
      )}
    </div>

    <ul className="nav flex-column gap-2 flex-grow-1">
      <SidebarItem to="/home" icon={<House size={18} />} label="Home" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="customer-profile" icon={<User size={18} />} label="Profile" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer/proposals" icon={<FileText size={18} />} label="Project Proposals" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer-chat-list" icon={<MessageCircle size={18} />} label="Chat" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer/shortlisted-proposals" icon={<FileText size={18} />} label="Shortlisted Proposals" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer/accepted-proposals" icon={<FileText size={18} />} label="Accepted Proposals" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer/contractors" icon={<Users size={18} />} label="Browse Contractors" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer/projects" icon={<MessageCircle size={18} />} label="Make Request" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      <SidebarItem to="/customer/see-request" icon={<MessageCircle size={18} />} label="View Request" collapsed={collapsed} setShowSidebar={setShowSidebar} />
      {/* <SidebarItem to="/customer/floor-plan" icon={<Map size={18} />} label="Floor Plan AI" collapsed={collapsed} setShowSidebar={setShowSidebar} /> */}
    </ul>

    <div className="mt-auto pt-4">
      <button
        onClick={handleLogout}
        className={`w-100 d-flex align-items-center ${collapsed ? "justify-content-center" : "gap-2"} py-2 rounded-pill`}
        style={{
          background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
          border: "none",
          color: "#253863",
          fontWeight: "600",
          transition: "all 0.3s ease",
        }}
      >
        <LogOut size={18} />
        {!collapsed && "Logout"}
      </button>
    </div>
  </>
);

/* Sidebar Item */
const SidebarItem = ({ to, icon, label, collapsed, setShowSidebar }) => (
  <li className="nav-item">
    <NavLink
      to={to}
      onClick={() => setShowSidebar && setShowSidebar(false)}
      className={({ isActive }) =>
        `nav-link d-flex align-items-center ${collapsed ? "justify-content-center" : "gap-3"} px-3 py-2 rounded-3 ${isActive ? "active-link" : ""}`
      }
      style={({ isActive }) => ({
        color: isActive ? "#0f172a" : "rgba(255,255,255,0.8)",
        background: isActive ? "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)" : "transparent",
        transition: "all 0.3s ease",
      })}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  </li>
);
