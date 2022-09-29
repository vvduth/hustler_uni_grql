import path from "path";

import http from "http";
import { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { notFound, ErrorHandler } from "./middlewares/errorHandler";
import userRoutes from "./routers/userRoutes";
import cors from "cors";
import User from "./models/userModel";
import Message from "./models/messageModel";
import { getFormatTime, getFormattedDate } from "./utils/formaDateAndTime";

export interface IUserBackEnd {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  status?: "online" | "offline";
  token?: string;
  save: () => any;
}

export interface IMessageBackEnd {
  _id?: string;
  content: string;
  from: IUserBackEnd | any;
  time: string;
  date: string;
  to: string;
}

const BOT = {
  _id: "123bot",
  name: "CHAT_BOT",
  email: "bot@email.com",
};

const rooms = ["general", "football", "gym", "crypto", "tech"];

async function getLastMessagesFromRoom(room: any) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages: IMessageBackEnd[] | any[]) {
  return messages.sort(function (a: any, b: any) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

dotenv.config();
connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use("/api/users", userRoutes);

// socket connection
io.on("connection", (socket) => {
  // show all user after user login/signup
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  // will work with both rooms chat and private dm
  socket.on("join-room", async (newRoom, previousRoom, username?) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    

    if (newRoom.length <= 11) {
      // notification mess that a new user join
      let bot_notification: IMessageBackEnd = {
        content: `${username} has join new ${newRoom}`,
        from: BOT,
        time: getFormatTime(),
        date: getFormattedDate(),
        to: `${newRoom}`,
      };

      // save mess in datase
      await Message.create(bot_notification);

      // retrive all database of the new room
      let roomMessages = await getLastMessagesFromRoom(newRoom);

      roomMessages = sortRoomMessagesByDate(roomMessages);

      // render all messages
      socket.emit("room-messages", roomMessages);

      io.to(newRoom).emit("room-messages", roomMessages);
    } else {
      // retrive all database of the new room
      let roomMessages = await getLastMessagesFromRoom(newRoom);

      roomMessages = sortRoomMessagesByDate(roomMessages);

      // render all messages
      socket.emit("room-messages", roomMessages);
    }
  });
  socket.on("leave-room", async (room , username) => {
   

    if (room.length < 11) {
      
      
      let bot_notification: IMessageBackEnd = {
        content: `${username} has left ${room}`,
        from: BOT,
        time: getFormatTime(),
        date: getFormattedDate(),
        to: `${room}`,
      };

      // save mess in datase
      await Message.create(bot_notification);

      // retrive all database of the new room
      let roomMessages = await getLastMessagesFromRoom(room);

      roomMessages = sortRoomMessagesByDate(roomMessages);

      // render all messages
      socket.emit("room-messages", roomMessages);

      // send noti to all other users i the old room , not you
      io.to(room).emit("room-messages", roomMessages);
    }
  })
  socket.on("message-room", async (room, content, sender, time, date) => {
    
    // create and save to mess tinto the database
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    // re-sort and re-arrange the messages after adding the new mess one
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);

    // re render and send notfi
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  app.delete("/logout", async (req, res) => {
    try {
      // switch status offline
      const { _id } = req.body;
      const user = (await User.findById(_id)) as IUserBackEnd;
      user.status = "offline";
      await user.save();

      // send a new member list with update statsu to other online users
      const members = (await User.find()) as IUserBackEnd[];
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});
const PORT =  process.env.PORT || 5000 ;

server.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});

app.get("/", (_req: Request, res: Response) => {
  res.send("<p>Hello and welcome to node js</p>");
});
