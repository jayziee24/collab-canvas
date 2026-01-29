const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', (socket) => {
        console.log(`User disconnected: ${socket.id}`);
    })
})

const PORT = 3001
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})