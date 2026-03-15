import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ContractorSidebar } from "./ContractorSidebar";
import { ContractorHeader } from "./ContractorHeader";

export const ContractorLayout = () => {
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {isMobile && showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 998,
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
          zIndex: 999,
        }}
      >
        <ContractorSidebar
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
        <ContractorHeader setShowSidebar={setShowSidebar} />
        <main
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#f8f9fa",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};