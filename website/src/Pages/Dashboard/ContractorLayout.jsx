import React, { useState, useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { Outlet } from "react-router-dom";
import { ContractorSidebar } from "./ContractorSidebar";
import { ContractorHeader } from "./ContractorHeader";
import { Modal, Button } from "react-bootstrap";
import { SeeAllOpenProjects } from "./SeeAllOpenProjects";
import { Briefcase } from "lucide-react";

export const ContractorLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { isProjectModalOpen, setIsProjectModalOpen, notifications } = useDashboard();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(false);
    };
    
    // Check if we should show the "New Projects" modal on login
    const hasBeenShown = sessionStorage.getItem("contractorLoginModalShown");
    if (!hasBeenShown) {
        setIsProjectModalOpen(true);
        sessionStorage.setItem("contractorLoginModalShown", "true");
    }

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

      {/* Login Notification Modal */}
      <Modal 
        show={isProjectModalOpen} 
        onHide={() => setIsProjectModalOpen(false)} 
        size="lg" 
        centered
        className="contractor-login-modal"
        style={{ zIndex: 1100 }}
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center gap-2 text-primary fw-bold">
            <Briefcase className="text-success" />
            {notifications.newProjects} New Projects Available!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "20px" }}>
            <p className="fw-semibold text-dark mb-3">
              Welcome back! There are currently <span className="text-success">{notifications.newProjects}</span> projects waiting for your proposal.
            </p>
            <SeeAllOpenProjects isModal={true} />
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setIsProjectModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
              setIsProjectModalOpen(false);
              window.location.href = "/All-pending-projects-list";
          }}>
            View All Projects
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
