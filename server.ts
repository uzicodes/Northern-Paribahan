import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handle);

    // Initialize Socket.io
    const io = new Server(httpServer);

    // Socket Logic
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Join a specific bus room (e.g., "bus-123")
        socket.on("join-bus", (busId) => {
            socket.join(`bus-${busId}`);
            console.log(`Socket ${socket.id} joined bus-${busId}`);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });

    // Make IO accessible globally for API routes
    (global as any).io = io;

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});