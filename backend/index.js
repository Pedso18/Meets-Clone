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

io.on('connection', (socket) => {

    const socketId = socket.id;

    console.log(socket.id, 'connected!');

    socket.on("message", e => {

        io.sockets.emit("message", {from: socketId, text: e});

    });

});






