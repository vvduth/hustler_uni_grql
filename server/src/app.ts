import path from "path";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import formatMessage from "./utils/messages";
import {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUser,
} from "./utils/users";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const botName = "Admin";
// set the sttatic folders
app.use(express.static(path.join(__dirname, "../client")));

// run when client connects
io.on("connection", (socket) => {
  console.log("New websocket connection");

  // Join room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, "Welcome to Hustler University!")
    );

    // Broadcast when user connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} user has joined the chat`)
      );

    // send user room infor
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUser(user.room),
    });
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    // emit to everyone on the client side inthe chat room
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs left client disconnects
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUser(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
