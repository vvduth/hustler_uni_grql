import path from "path";

import http from "http";
import { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv'
import connectDB from "./config/db";
import {notFound, ErrorHandler} from './middlewares/errorHandler'
import userRoutes from './routers/userRoutes'

const rooms =['general', 'football', 'gym', 'crypto', 'tech']


dotenv.config()
connectDB() ; 

const app = express();

const server = http.createServer(app);

const io = new Server(server ,{
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST']
  }

});
app.use(express.json() )
app.use('/api/users', userRoutes)



const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});

app.get("/", (_req: Request , res: Response) => {
  res.send("<p>Hello and welcome to node js</p>")
})
