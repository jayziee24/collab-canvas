const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let drawHistory = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  if (drawHistory.length > 0) {
    socket.emit("board_state", drawHistory);
  }

  socket.on("draw_line", (data) => {
    drawHistory.push(data);
    socket.broadcast.emit("draw_line", data);
  });

  socket.on("undo", () => {
    if (drawHistory.length > 0) {
      const lastItem = drawHistory[drawHistory.length - 1];
      const lastStrokeId = lastItem.strokeId;

      if (lastStrokeId) {
        drawHistory = drawHistory.filter(
          (item) => item.strokeId !== lastStrokeId,
        );
      } else {
        drawHistory.pop();
      }
      io.emit("board_state", drawHistory);
    }
  });
  socket.on("cursor_move", ({ x, y }) => {
    socket.broadcast.emit("cursor_update", {
      id: socket.id,
      x,
      y,
    });
  });

  socket.on("clear", () => {
    drawHistory = [];
    io.emit("board_state", drawHistory);
  });
  socket.on("disconnect", (socket) => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
