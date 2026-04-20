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
      const mobileView = window.innerWidth < 992;
      setIsMobile(mobileView);
      if (!mobileView) setShowSidebar(false);
    };
    
    // Check if we should show the "New Projects" modal on login
    const hasBeenShown = sessionStorage.getItem("contractorLoginModalShown");
    if (!hasBeenShown && notifications.newProjects > 0) {
        setIsProjectModalOpen(true);
        sessionStorage.setItem("contractorLoginModalShown", "true");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [notifications.newProjects, setIsProjectModalOpen]);

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", position: "relative", backgroundColor: "#f1f5f9" }}>
        {/* Mobile overlay */}
        {isMobile && showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(4px)",
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
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 999,
            boxShadow: "4px 0 24px rgba(0,0,0,0.05)",
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
            transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ContractorHeader setShowSidebar={setShowSidebar} />
          <main
            style={{
              flex: 1,
              padding: isMobile ? "15px" : "30px",
              backgroundColor: "#f8fafc",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* Login Notification Modal - Premium Design */}
      <Modal 
        show={isProjectModalOpen} 
        onHide={() => setIsProjectModalOpen(false)} 
        size="lg" 
        centered
        className="contractor-login-modal"
        contentClassName="border-0 shadow-2xl rounded-4 overflow-hidden"
        style={{ zIndex: 1100 }}
      >
        <div style={{ 
          background: "linear-gradient(135deg, #253863 0%, #1e293b 100%)", 
          padding: "25px", 
          borderBottom: "4px solid #fbbf24" 
        }}>
          <Modal.Header closeButton closeVariant="white" className="border-0 p-0 mb-2">
            <Modal.Title className="d-flex align-items-center gap-3 text-white fw-bold fs-4">
              <div className="p-2 rounded-3 bg-warning bg-opacity-25 mr-2">
                <Briefcase className="text-warning" size={28} />
              </div>
              Opportunities Await!
            </Modal.Title>
          </Modal.Header>
          <p className="text-white-50 mb-0 small">
            We found some high-potential projects matching your profile.
          </p>
        </div>

        <Modal.Body className="bg-light p-4">
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
               <h6 className="text-secondary fw-bold mb-0">
                  <span className="badge bg-warning text-dark me-2">{notifications.newProjects}</span>
                  New Projects Available
               </h6>
               <span className="text-muted small">Updated just now</span>
            </div>
            
            <SeeAllOpenProjects isModal={true} isCompact={true} />
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-white border-top-0 p-3">
          <Button 
            variant="link" 
            className="text-muted text-decoration-none fw-semibold" 
            onClick={() => setIsProjectModalOpen(false)}
          >
            Maybe Later
          </Button>
          <Button 
            style={{ background: "#253863", border: "none", borderRadius: "50px", padding: "10px 25px" }}
            className="fw-bold shadow-sm"
            onClick={() => {
              setIsProjectModalOpen(false);
              window.location.href = "/All-pending-projects-list";
            }}
          >
            Explore All Projects
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
