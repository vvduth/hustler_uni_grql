import path from "path";

import http from "http";
import { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv'


dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// set the sttatic folders


// run when client connects


const PORT = 80 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});

app.get("/", (_req: Request , res: Response) => {
  res.send("<p>Hello and welcome to node js</p>")
})
