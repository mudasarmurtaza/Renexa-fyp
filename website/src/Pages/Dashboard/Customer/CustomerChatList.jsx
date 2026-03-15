import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CustomerChatList = () => {
    const [acceptedProposals, setAcceptedProposals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcceptedProposals = async () => {
            try {
                const customer = JSON.parse(localStorage.getItem("customer"));
                if (!customer) return;

                const customerId = customer._id || customer.id; // ✅ handle both cases

                const response = await fetch(
                    `http://localhost:5000/proposals/customer/${customerId}/accepted`
                );

                const data = await response.json();

                if (response.ok) {
                    setAcceptedProposals(data);
                } else {
                    console.error(data.message || "Failed to fetch proposals");
                }
            } catch (error) {
                console.error("Error fetching accepted proposals:", error);
            }
        };


        fetchAcceptedProposals();
    }, []);

    const openChat = (proposalId) => {
        fetch("http://localhost:5000/chat/room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
            },
            body: JSON.stringify({ proposalId }),
        })
            .then((res) => res.json())
            .then((chatRoom) => {
                navigate(`/chat/${chatRoom._id}`);
            })
            .catch(console.error);
    };

    return (
        <div className="container mt-4">
            <h2>Chats with Contractors</h2>
            {acceptedProposals.length === 0 && <p>No accepted proposals yet.</p>}
            <ul className="list-group">
                {acceptedProposals.map((proposal) => (
                    <li
                        key={proposal._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <img
                                src={proposal.contractor.profilePic}
                                alt={proposal.contractor.name}
                                width={40}
                                height={40}
                                style={{ borderRadius: "50%", marginRight: "10px" }}
                            />
                            <strong>{proposal.contractor.name}</strong>
                        </div>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openChat(proposal._id)}
                        >
                            Open Chat
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
