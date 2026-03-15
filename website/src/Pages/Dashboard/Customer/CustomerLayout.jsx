import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSidebar } from "./CustomerSidebaar"; // make sure the file is correctly named

export const CustomerLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      if (!mobile) {
        setShowSidebar(false); // auto close overlay when switching to desktop
      }
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
            zIndex: 999,
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
          zIndex: 1000,
        }}
      >
        <CustomerSidebar
          showSidebar={showSidebar}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setShowSidebar={setShowSidebar}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          // Desktop: leave space for sidebar; Mobile: full width
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