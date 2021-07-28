// Using express: http://expressjs.com/
const express = require("express");
const socketIo = require("socket.io");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const server = app.listen(PORT, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});

const io = socketIo(server);

let art = [];
let userCount = 0;

io.sockets.on("connection", socket => {
  userCount++;
  console.log(`User Connected (${userCount} users online)`);

  socket.emit("art", art);
  io.emit("userCount", userCount);

  socket.on("art", data => {
    art.push(data);
    io.emit("data", data);
  });

  socket.on("clear", () => {
    art = []
    io.emit("art", art);
  });

  socket.on("disconnect", () => {
    userCount--;
    io.emit("userCount", userCount);

    console.log(`User Disconnected (${userCount} users online)`);
  });
});
