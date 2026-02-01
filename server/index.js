const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all connections
    methods: ["GET", "POST"],
  },
});

let drawHistory = [];
let redoStack = [];
let users = {};

const getRandomName = () => `User ${Math.floor(Math.random() * 1000)}`;
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  users[socket.id] = {
    id: socket.id,
    name: getRandomName(),
    color: getRandomColor(),
  };
  io.emit("users_update", Object.values(users));

  if (drawHistory.length > 0) {
    socket.emit("board_state", drawHistory);
  }

  socket.on("draw_line", (data) => {
    redoStack = [];
    drawHistory.push(data);
    socket.broadcast.emit("draw_line", data);
  });

  socket.on("undo", () => {
    if (drawHistory.length > 0) {
      const lastItem = drawHistory[drawHistory.length - 1];
      const lastStrokeId = lastItem.strokeId;

      if (lastStrokeId) {
        const strokePackets = drawHistory.filter(
          (item) => item.strokeId === lastStrokeId,
        );
        redoStack.push(strokePackets);

        drawHistory = drawHistory.filter(
          (item) => item.strokeId !== lastStrokeId,
        );
      } else {
        drawHistory.pop();
      }
      io.emit("board_state", drawHistory);
    }
  });

  socket.on("redo", () => {
    if (redoStack.length > 0) {
      const strokesRestored = redoStack.pop();
      drawHistory.push(...strokesRestored);
      io.emit("board_state", drawHistory);
    }
  });

  socket.on("cursor_move", ({ x, y }) => {
    // Added safety check (?.) in case server restarted and memory is wiped
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit("cursor_update", {
        id: socket.id,
        x,
        y,
        name: user.name,
        color: user.color,
      });
    }
  });

  socket.on("clear", () => {
    drawHistory = [];
    io.emit("board_state", drawHistory);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit("users_update", Object.values(users));
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
