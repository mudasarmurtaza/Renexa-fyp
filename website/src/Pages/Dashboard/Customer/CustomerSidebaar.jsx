import {
  House,
  User,
  ClipboardCheck,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Map,
} from "lucide-react";
import { FileText } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router";

export const CustomerSidebar = ({ showSidebar, collapsed, setCollapsed, setShowSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/home");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="d-none d-lg-flex flex-column text-white p-4"
        style={{
          width: "100%",
          backgroundColor: "#253863",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <ToggleButton collapsed={collapsed} setCollapsed={setCollapsed} />
        <SidebarContent handleLogout={handleLogout} collapsed={collapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className="d-lg-none d-flex flex-column text-white p-4"
        style={{
          width: "100%",
          backgroundColor: "#253863",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        {setShowSidebar && (
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
        )}
        <SidebarContent handleLogout={handleLogout} collapsed={false} />
      </aside>
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
    }}
  >
    {collapsed ? (
      <ChevronRight size={16} color="#253863" />
    ) : (
      <ChevronLeft size={16} color="#253863" />
    )}
  </div>
);

/* Sidebar Content */
const SidebarContent = ({ handleLogout, collapsed }) => (
  <>
    <div className="mb-4">
      {!collapsed && (
        <>
          <h5 className="fw-bold mb-0 text-white">
            Renexa<span style={{ color: "#fbbf24" }}>.ai</span>
          </h5>
          <small style={{ color: "rgba(255,255,255,0.6)" }}>
            Smart Construction
          </small>
        </>
      )}
    </div>

    <ul className="nav flex-column gap-2 flex-grow-1">
      <SidebarItem to="/home" icon={<House size={18} />} label="Home" collapsed={collapsed} />
      <SidebarItem to="customer-profile" icon={<User size={18} />} label="Profile" collapsed={collapsed} />
      <SidebarItem to="/customer/proposals" icon={<FileText size={18} />} label="Project Proposals" collapsed={collapsed} />
      <SidebarItem to="/customer-chat-list" icon={<MessageCircle size={18} />} label="Chat" collapsed={collapsed} />
      <SidebarItem to="/customer/shortlisted-proposals" icon={<FileText size={18} />} label="Shortlisted Proposals" collapsed={collapsed} />
      <SidebarItem to="/customer/accepted-proposals" icon={<FileText size={18} />} label="Accepted Proposals" collapsed={collapsed} />
      <SidebarItem to="/customer/projects" icon={<MessageCircle size={18} />} label="Make Request" collapsed={collapsed} />
      <SidebarItem to="/customer/see-request" icon={<MessageCircle size={18} />} label="View Request" collapsed={collapsed} />
      <SidebarItem to="/customer/floor-plan" icon={<Map size={18} />} label="Floor Plan AI" collapsed={collapsed} />
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