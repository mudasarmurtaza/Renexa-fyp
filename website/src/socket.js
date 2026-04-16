import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

const socket = io(API_BASE_URL, {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

export default socket;
