import React from "react";
import { useState } from "react";
import socketIo from "socket.io-client";
const socketUrl = "http://127.0.0.1:8080";

export const socket = socketIo.connect(socketUrl, { transports : ['websocket'] });
export const SocketContext = React.createContext();
