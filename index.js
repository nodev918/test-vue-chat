"use strict";
exports.__esModule = true;
// @ts-nocheck 
var express_1 = require("express");
var http_1 = require("http");
var cors_1 = require("cors");
var socket_io_1 = require("socket.io");
var PORT = process.env.PORT || 3001;
// import * as path from 'path'
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
// // const __dirname = dirname(fileURLToPath(import.meta.url));
var path = require("path");
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])());
var server = http_1["default"].createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"]
    }
});
app.use(express_1["default"].static('client/dist'));
app.get("*", function (req, res) {
    console.log("request");
    // res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
    res.sendFile("./client/dist/index.html");
});
io.on("connection", function (socket) {
    console.log("User Connected: ".concat(socket.id));
    socket.on("join_room", function (data) {
        socket.join(data);
        console.log("User with ID: ".concat(socket.id, " joined room: ").concat(data));
    });
    socket.on("send_message", function (data) {
        socket.to(data.room).emit("receive_message", data);
    });
    socket.on("disconnect", function () {
        console.log("User Disconnected", socket.id);
    });
});
server.listen(PORT, function () {
    console.log("server listening: ".concat(PORT));
});
