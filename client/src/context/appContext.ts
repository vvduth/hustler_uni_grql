import { io } from "socket.io-client";
import React from "react";
import { BACKEND } from "../url";
const SOCKET_URL = BACKEND;
export const socket = io(BACKEND);
// app context
export const AppContext = React.createContext<any>(null);