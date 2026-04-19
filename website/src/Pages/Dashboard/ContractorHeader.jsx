import React, { useState } from "react";
import { Search, Bell, User, Menu, MessageSquare, Briefcase } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";

export const ContractorHeader = ({ setShowSidebar }) => {
  const { searchTerm, setSearchTerm, notifications } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white sticky-top shadow-sm" style={{ zIndex: 1000 }}>
      {/* Mobile toggle button */}
      <button
        className="btn d-lg-none"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu size={22} />
      </button>

      <h5 className="mb-0 ms-3 fw-semibold d-none d-lg-block text-primary">Contractor Dashboard</h5>

      <div className="d-flex align-items-center gap-4">
        <div className="position-relative d-none d-md-block">
          <Search
            size={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
          />
          <input
            type="text"
            className="form-control ps-5 rounded-pill border-light bg-light"
            placeholder="Search documents, projects..."
            style={{ width: "300px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="position-relative">
          <div 
            className="cursor-pointer position-relative p-1"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={22} className="text-muted" />
            {notifications.total > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                style={{ fontSize: "0.6rem" }}
              >
                {notifications.total}
              </span>
            )}
          </div>

          {showNotifications && (
            <div 
              className="position-absolute end-0 mt-3 bg-white shadow-lg rounded-3 border overflow-hidden animate-fade-in"
              style={{ width: "320px", zIndex: 1100 }}
            >
              <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                <span className="fw-bold">Notifications</span>
                <span className="badge bg-primary rounded-pill">{notifications.total} New</span>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {notifications.chatList.length > 0 ? (
                  notifications.chatList.map((chat) => (
                    <div 
                      key={chat.roomId}
                      className="p-3 border-bottom cursor-pointer hover-bg-light d-flex gap-3 align-items-start"
                      onClick={() => {
                          navigate(`/chat/${chat.roomId}`);
                          setShowNotifications(false);
                      }}
                    >
                      <div className="position-relative">
                        <img 
                          src={chat.customerProfilePic || "/default-avatar.png"} 
                          alt="" 
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-white" style={{ fontSize: "0.6rem" }}>
                          {chat.unreadCount}
                        </span>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-bold small text-truncate">{chat.customerName}</div>
                        <div className="text-muted small text-truncate">{chat.lastMessage}</div>
                        <div className="text-muted" style={{ fontSize: "0.65rem" }}>
                          {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : notifications.newProjects === 0 ? (
                    <div className="p-4 text-center text-muted small">No new notifications</div>
                ) : null}
              </div>
              <div className="p-2 text-center border-top">
                <small className="text-primary cursor-pointer hover-underline">Mark all as read</small>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigate("/contractor-profile")}>
          <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
            <User size={20} className="text-primary" />
          </div>
          <span className="small fw-semibold d-none d-md-block text-secondary">My Profile</span>
        </div>
      </div>
    </header>
  );
};
