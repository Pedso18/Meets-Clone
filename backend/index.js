const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 8080;

app.use(cors("http://localhost:3000"));

app.get("", (req, res) => {

    res.send("hello world!");

});

app.use(express.json());

var server = app.listen(port, function () {

    console.log("listening on " + port);
    
});

const io = require('socket.io')(server);

var amount = 0;
var socketIds = [];

io.on('connection', (socket) => {

    const socketId = socket.id;

    for(let i = 0; i < socketIds.length; i++){
        socket.emit("id", socketIds[i]);
    }
    
    socketIds.push(socketId);

    amount++;
    console.log(amount);

    console.log(socket.id, 'connected!');

    io.sockets.emit("users", amount);
    
    socket.broadcast.emit("id", socketId);


    socket.on("message", e => {

        io.sockets.emit("message", {from: socketId, text: e});

    });

    socket.on("audio", e => {

        socket.broadcast.emit("audio", e);

    });
    
    socket.on("videoTest", e => {

        socket.broadcast.emit("videoTest", {video: e, from: socketId});

    });
    
    socket.on("video", e => {

        console.log("I'm receiving a video from: ", socketId);
        socket.broadcast.emit('video', {video: e, from: socketId});

    });
    
    socket.on("videoDeath", e => {

        socket.broadcast.emit('videoDeath', socketId);

    });

    socket.on('disconnect', function(){
        amount--;

        socket.broadcast.emit("users", amount);
        socket.broadcast.emit("idDeath", socketId);

        for(let i = 0; i < socketIds.length; i++){

            if(socketIds[i] == socketId){
                socketIds.splice(i, 1);
                break;
            }

        }

    });

});






