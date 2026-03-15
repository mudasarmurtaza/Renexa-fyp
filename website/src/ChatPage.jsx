import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "./socket";

export const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const customer = JSON.parse(localStorage.getItem("customer"));
  const contractor = JSON.parse(localStorage.getItem("contractor"));
  const user = customer || contractor;
  const senderId = user?._id || user?.id;

  const token = customer
    ? localStorage.getItem("customerToken")
    : localStorage.getItem("token");

  const [chatUser, setChatUser] = useState({
    name: "Chat",
    image: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  /* 🔥 JOIN SOCKET ROOM */
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, [roomId]);

  /* 🔥 LOAD OLD MESSAGES */
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:5000/chat/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));
  }, [roomId]);

  /* 👤 LOAD CHAT HEADER USER */
  useEffect(() => {
    if (!roomId || !senderId) return;

    fetch(`http://localhost:5000/chat/room/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.contractor === senderId) {
          setChatUser({
            name: data.customerName,
            image:
              data.customerProfilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          });
        } else {
          setChatUser({
            name: data.contractorName,
            image:
              data.contractorProfilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          });
        }
      })
      .catch(() => {});
  }, [roomId, senderId]);

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  /* 🔥 SEND MESSAGE */
  const sendMessage = () => {
    if (!text.trim() || !senderId) return;

    socket.emit("chatMessage", {
      roomId,
      senderId,
      senderName: user.name,
      message: text,
    });

    setText("");
  };

  /* 🔼 IMAGE UPLOAD */
  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", roomId);
    formData.append("senderId", senderId);
    formData.append("senderName", user.name);

    const res = await fetch("http://localhost:5000/chat/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setMessages((prev) => [...prev, data]);
    setPreviewImage(null);
    setImageFile(null);
  };

  /* 🔼 IMAGE SELECT & PREVIEW */
  const handleImageSelect = (file) => {
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  /* ⏰ FORMAT TIME */
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mt-3">
      {/* 🔝 HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "20px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <img
          src={chatUser.image}
          alt="user"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
            objectFit: "cover",
          }}
        />

        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{chatUser.name}</div>
      </div>

      {/* 💬 CHAT BOX */}
      <div
        id="chat-box"
        style={{
          height: "calc(100vh - 260px)",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        {messages.map((m, i) => {
          const isMe = m.senderId === senderId;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: "18px",
                  backgroundColor: isMe ? "rgb(229, 229, 234)" : "#e5e5ea",
                  color: isMe ? "#fff" : "#000",
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>{m.senderName}</div>
                )}
                {m.image && (
                  <img
                    src={`http://localhost:5000${m.image}`}
                    alt="sent"
                    style={{
                      maxWidth: "200px",
                      borderRadius: "10px",
                      marginBottom: "5px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={() => setPreviewImage(`http://localhost:5000${m.image}`)}
                  />
                )}
                {m.message && <div>{m.message}</div>}
                <div
                  style={{
                    fontSize: "10px",
                    textAlign: "right",
                    opacity: 0.7,
                  }}
                >
                  {formatTime(m.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✍️ INPUT WITH IMAGE ICON AND SEND BUTTON INLINE */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, marginRight: "5px" }}
        />

        <label
          style={{
            cursor: "pointer",
            fontSize: "20px",
            marginRight: "5px",
          }}
        >
          📎
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageSelect(e.target.files[0])}
          />
        </label>

        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>

      {/* 🔼 IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            style={{
              maxWidth: "90%",
              maxHeight: "80%",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              marginBottom: "15px",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Show Send Image button only for newly selected images */}
          {imageFile && (
            <button
              className="btn btn-success"
              style={{ padding: "10px 20px" }}
              onClick={() => handleImageUpload(imageFile)}
            >
              Send Image
            </button>
          )}
        </div>
      )}
    </div>
  );
};
