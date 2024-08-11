import { IncomingMessage, Server as ServerType, ServerResponse } from "http";
import { Server } from "socket.io";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const initializeSocketConnection = (
  server: ServerType<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new Server(server, {
    pingTimeout: 120000,
    cors: {
      origin: CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    // console.log(`User connected: ${socket.id}`);

    socket.on("join", (roomid) => {
      socket.join(roomid);
    });

    socket.on("message", (groupId, senderId, senderName, message) => {
      // socket.to(groupId).emit("receive-message", sender, message);
      socket.broadcast
        .to(groupId)
        .emit("receive-message", groupId, senderId, senderName, message);
    });
  });
};
export default initializeSocketConnection;