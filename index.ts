// @ts-nocheck 
import express from "express";
import http   from "http";
import cors from "cors";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3001
// import * as path from 'path'
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// // const __dirname = dirname(fileURLToPath(import.meta.url));

const path = require("path")

interface UserSentMessage {
    room: string
    author: string
    message: string
    time: string
}

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://ochato.herokuapp.com",
        methods: ["GET", "POST"],
    }
})


app.use(express.static('client/dist'))
app.get("*",(req,res)=>{
    console.log("request")
// res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
res.sendFile("./client/dist/index.html")
})


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })
    socket.on("send_message", (data: UserSentMessage) => {
        socket.to(data.room).emit("receive_message", data);
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
})

server.listen(PORT, () => {
    console.log(`server listening: ${PORT}`);
})