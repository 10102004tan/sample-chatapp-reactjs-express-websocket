const express = require('express')
const { Server } = require('socket.io')
const {createServer} = require('node:http');
const app = express()
const port = 5000
const cors = require('cors')

const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
});

io.on('connection', (socket) => {
    console.log("user connected")

    socket.on("join_room", ({ name, room }) => {
        socket.join(room)
        console.log(`User ${name} joined room ${room}`)
    });


    socket.on("send_message", ({room, name, message}) => {
        console.log(`User ${name} in room ${room} sent message: ${message}`)
        socket.to(room).emit("receive_message", {name, message})
    });

    

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })


})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})