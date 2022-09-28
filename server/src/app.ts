import path from "path";

import http from "http";
import { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv'
import connectDB from "./config/db";
import {notFound, ErrorHandler} from './middlewares/errorHandler'
import userRoutes from './routers/userRoutes'
import cors from "cors";
import User from "./models/userModel";
import Message from "./models/messageModel";

const rooms =['general', 'football', 'gym', 'crypto', 'tech']

async function getLastMessagesFromRoom(room:any){
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages;
}

function sortRoomMessagesByDate(messages:any){
  return messages.sort(function(a:any, b:any){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1]
    date2 =  date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}


dotenv.config()
connectDB() ; 

const app = express();

const server = http.createServer(app);

const io = new Server(server ,{
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }

});
app.use(express.json() )
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use('/api/users', userRoutes)

// socket connection 
io.on('connection', (socket)=> {

  // show all user after user login/signup
  socket.on('new-user', async () => {
    const members = await User.find();
    io.emit('new-user', members)
  })

  socket.on('join-room', async(newRoom, previousRoom)=> {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async(room, content, sender, time, date) => {
    const newMessage = await Message.create({content, from: sender, time, date, to: room});
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit('room-messages', roomMessages);
    socket.broadcast.emit('notifications', room)
  })
})

app.get('/api/rooms', (req, res)=> {
  res.json(rooms)
})
const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});

app.get("/", (_req: Request , res: Response) => {
  res.send("<p>Hello and welcome to node js</p>")
})
