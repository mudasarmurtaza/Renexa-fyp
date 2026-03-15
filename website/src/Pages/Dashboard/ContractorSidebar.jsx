import {
  House,
  User,
  Map,
  Upload,
  ClipboardCheck,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import React from "react";

/* Sidebar Component */
export const ContractorSidebar = ({ showSidebar, setShowSidebar, collapsed, setCollapsed }) => {
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
        <SidebarContent handleLogout={handleLogout} collapsed={collapsed} />
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
            zIndex: 1000,
            transition: "all 0.3s ease",
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
          <SidebarContent handleLogout={handleLogout} collapsed={false} />
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
    {collapsed ? <ChevronRight size={16} color="#3B6D8A" /> : <ChevronLeft size={16} color="#3B6D8A" />}
  </div>
);

/* Sidebar Content */
const SidebarContent = ({ handleLogout, collapsed }) => (
  <>
    <div className="mb-5">
      {!collapsed && (
        <>
          <h5 className="fw-bold mb-0 text-white">
            Renexa<span style={{ color: "#fbbf24" }}>.AI</span>
          </h5>
          <small style={{ color: "rgba(255,255,255,0.6)" }}>Smart House</small>
        </>
      )}
    </div>

    <ul className="nav flex-column gap-2 flex-grow-1">
      <SidebarItem to="/home" icon={<House size={18} />} label="Home" collapsed={collapsed} />
      <SidebarItem to="contractor-profile" icon={<User size={18} />} label="Profile" collapsed={collapsed} />
      <SidebarItem to="/contractor/accepted-proposals" icon={<ClipboardCheck size={18} />} label="Accepted Proposals" collapsed={collapsed} />
      <SidebarItem to="#" icon={<Map size={18} />} label="2D Map Predict" collapsed={collapsed} />
      {/* <SidebarItem to="#" icon={<Upload size={18} />} label="Upload Images" collapsed={collapsed} /> */}
      <SidebarItem to="/contractor-project-track" icon={<ClipboardCheck size={18} />} label="Project Tracking" collapsed={collapsed} />
      <SidebarItem to="/contractor-chat-list" icon={<MessageCircle size={18} />} label="Chat" collapsed={collapsed} />
      <SidebarItem to="/All-pending-projects-list" icon={<MessageCircle size={18} />} label="See Available Projects" collapsed={collapsed} />
    </ul>

    <div className="mt-auto pt-4">
      <button
        onClick={handleLogout}
        className={`w-100 d-flex align-items-center ${collapsed ? "justify-content-center" : "gap-2"} py-2 rounded-pill`}
        style={{
          background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
          border: "none",
          color: "#3B6D8A",
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
const SidebarItem = ({ to, icon, label, collapsed }) => (
  <li className="nav-item">
    <NavLink
      to={to}
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