const io = require("socket.io-client");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTk5YzViODI4NmZmZDIxMjdkYjExOCIsImlhdCI6MTc0NjUyNDUzMywiZXhwIjoxNzQ2NTI4MTMzfQ.emWJPit_vJnMAMaJ1acfSVvBFHwRy1bgdl0pGJzgnCo"; // Replace with JWT from login
const socket = io("http://localhost:8000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("joinRoom", "6819db494cc7c6595f570e18"); // Replace with room ID
});

socket.on("newMessage", (message) => {
  console.log("New message:", message);
});

socket.on("newNotification", (notification) => {
  console.log("New notification:", notification);
});

socket.on("roomUpdate", (room) => {
  console.log("Room updated:", room);
});

socket.on("roomDeleted", (data) => {
  console.log("Room deleted:", data);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

socket.on("joinedRoom", (roomId) => {
  console.log(`Joined room-${roomId}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
