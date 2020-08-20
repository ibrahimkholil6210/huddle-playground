const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(1337);;

console.log("Server running at 1337");

io.on("connection", socket => {
    socket.on("join-room", (roomid, userid) => {
        console.log(roomid, userid);
    });
    socket.emit("helloFromApi", "Hello my boy!");
})