import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CustomerChatList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const customer = JSON.parse(localStorage.getItem("customer"));
                if (!customer) return;

                const customerId = customer._id || customer.id; // ✅ handle both cases

                const token = localStorage.getItem("customerToken");

                const response = await fetch(
                    `/chat/customer/${customerId}/rooms`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setChatRooms(data);
                } else {
                    console.error(data.message || "Failed to fetch chat rooms");
                }
            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            }
        };


        fetchChatRooms();
    }, []);

    const openChat = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className="container mt-4">
            <h2>Chats with Contractors</h2>
            {chatRooms.length === 0 && <p className="text-muted">No chats found.</p>}
            <ul className="list-group">
                {chatRooms.map((chat) => (
                    <li
                        key={chat._id}
                        className="list-group-item d-flex justify-content-between align-items-center cursor-pointer hover-bg-light"
                        onClick={() => openChat(chat._id)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="position-relative">
                                <img
                                    src={chat.contractor?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt={chat.contractor?.name}
                                    width={45}
                                    height={45}
                                    style={{ borderRadius: "50%", marginRight: "15px", objectFit: "cover" }}
                                />
                                {chat.unreadCount > 0 && (
                                    <span 
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-white"
                                        style={{ fontSize: "0.6rem" }}
                                    >
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <strong className="d-block">{chat.contractor?.name}</strong>
                                <small className="text-muted text-truncate" style={{ maxWidth: "200px" }}>
                                    {chat.lastMessage}
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                            <small className="text-muted mb-1">
                                {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </small>
                            <button
                                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openChat(chat._id);
                                }}
                            >
                                Chat
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
