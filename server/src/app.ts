import path from "path";
import express from "express";
import http from 'http' ;
import { Server } from "socket.io";
import formatMessage from "./utils/messages";


const app = express() ; 
const server = http.createServer(app) ;
const io = new Server(server);
const botName = 'Admin'
// set the sttatic folders
app.use(express.static(path.join(__dirname, '../client'))) ;


// run when client connects
io.on('connection', socket => {
    console.log("New websocket connection");

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Hustler University!'))

    // Broadcast when user connect
    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));

    // Runs left client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName,'A user has left the chat'))
    });

    // Listen for chat message
    socket.on('chatMessage', (msg) => {

        // emit to everyone on the client side inthe chat room
        io.emit('message', msg);
    })
})

const PORT = 3000 || process.env.PORT ; 

server.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`)
})