const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { log } = require("console");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id} `);

  socket.on("send-message", (message) => {
    //broadcast the message to all those connected:
    io.emit('received-message',message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
});

server.listen(5000, () => {
  console.log("server running at port 5000.");
});
