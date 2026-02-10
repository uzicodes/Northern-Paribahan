"use client";

import { io } from "socket.io-client";

// Connect to the same URL as the Next.js app
export const socket = io();