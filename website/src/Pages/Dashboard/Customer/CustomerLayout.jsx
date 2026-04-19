import React, { useState, useEffect } from "react";
import { useDashboard } from "../../../context/DashboardContext";
import { Outlet } from "react-router-dom";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerHeader } from "./CustomerHeader";
import AIChatBot from "../../../components/AIChatBot/AIChatBot";

export const CustomerLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
        {/* Mobile overlay */}
        {isMobile && showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1050,
              backdropFilter: "blur(2px)",
            }}
          />
        )}

        {/* Sidebar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: isMobile ? (showSidebar ? 0 : "-240px") : 0,
            width: isMobile ? 240 : collapsed ? 70 : 240,
            height: "100vh",
            transition: "all 0.3s ease",
            zIndex: 1100,
          }}
        >
          <CustomerSidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            marginLeft: !isMobile ? (collapsed ? 70 : 240) : 0,
            transition: "margin-left 0.3s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomerHeader setShowSidebar={setShowSidebar} />
          <main
            style={{
              flex: 1,
              padding: isMobile ? 15 : 25,
              backgroundColor: "#f8f9fa",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </main>
          <AIChatBot />
        </div>
      </div>
    </>
  );
};
