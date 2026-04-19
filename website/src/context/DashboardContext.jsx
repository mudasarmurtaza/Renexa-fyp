import React, { createContext, useState, useEffect, useContext } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState({
    unreadChats: 0,
    newProjects: 0,
    chatList: []
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null); // 'contractor' or 'customer'

  const fetchNotificationCounts = async (uid, userRole) => {
    const idToUse = uid || userId;
    const roleToUse = userRole || role;
    if (!idToUse || !roleToUse) return;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("customerToken");
      const res = await fetch(`/notifications/${roleToUse}/${idToUse}`, {
          headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      const resChats = await fetch(`/notifications/${roleToUse}/${idToUse}/chats`, {
          headers: { "Authorization": `Bearer ${token}` }
      });
      const chatData = await resChats.json();

      setNotifications({
        unreadChats: data.unreadChats || 0,
        newProjects: data.newProjects || 0,
        total: data.unreadChats || 0, // Only count messages for the badge
        chatList: chatData || []
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    const updateAuth = () => {
      const contractor = JSON.parse(localStorage.getItem("contractor"));
      const customer = JSON.parse(localStorage.getItem("customer"));
      
      let uid = null;
      let userRole = null;

      if (contractor) {
        uid = contractor._id || contractor.id;
        userRole = 'contractor';
      } else if (customer) {
        uid = customer._id || customer.id;
        userRole = 'customer';
      }

      setUserId(uid);
      setRole(userRole);
      if (uid && userRole) fetchNotificationCounts(uid, userRole);
    };

    updateAuth();
    window.addEventListener("authChange", updateAuth);
    window.addEventListener("storage", updateAuth);
    
    const interval = setInterval(() => {
        // We use state values here, so we don't pass arguments
        fetchNotificationCounts();
    }, 10000); 
    
    return () => {
      window.removeEventListener("authChange", updateAuth);
      window.removeEventListener("storage", updateAuth);
      clearInterval(interval);
    };
  }, [userId, role]);

  return (
    <DashboardContext.Provider value={{
      searchTerm,
      setSearchTerm,
      notifications,
      refreshNotifications: fetchNotificationCounts,
      isProjectModalOpen,
      setIsProjectModalOpen
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
