import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ContractorChatList = () => {
  const [acceptedProposals, setAcceptedProposals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedProposals = async () => {
      try {
        const contractor = JSON.parse(localStorage.getItem("contractor"));
        if (!contractor) return;

        const contractorId = contractor.id || contractor._id;
        if (!contractorId) {
          console.error("No contractor ID found in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/contractor/${contractorId}/accepted`
        );
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data)) {
          setAcceptedProposals(data);
        } else if (Array.isArray(data.proposals)) {
          setAcceptedProposals(data.proposals);
        } else {
          setAcceptedProposals([]);
        }
      } catch (error) {
        console.error("Error fetching accepted proposals:", error);
      }
    };

    fetchAcceptedProposals();
  }, []);

const openChat = (proposalId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ Contractor token missing");
    return;
  }

  fetch("http://localhost:5000/chat/room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ send token
    },
    body: JSON.stringify({ proposalId }),
  })
    .then((res) => res.json())
    .then((chatRoom) => {
      if (!chatRoom || !chatRoom._id) {
        console.error("❌ chatRoom._id missing", chatRoom);
        return;
      }
      navigate(`/chat/${chatRoom._id}`);
    })
    .catch(console.error);
};



  return (
    <div className="container mt-4">
      <h2>Chats with Customers</h2>
      {acceptedProposals.length === 0 && <p>No accepted proposals yet.</p>}
      <ul className="list-group">
        {acceptedProposals.map((proposal) => (
          <li
            key={proposal._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <img
                src={proposal.customer?.profilePic}
                alt={proposal.customer?.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
              <strong>{proposal.customer?.name}</strong>
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
