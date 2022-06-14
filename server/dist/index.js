"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 2000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const publicPath = path_1.default.join(__dirname, "../../public/dist");
app.use(express_1.default.static(publicPath));
app.get("*", (req, res) => {
    res.sendFile(`${publicPath}` + "/index.html");
});
io.on("connection", (socket) => {
    console.log(socket.rooms, socket.id);
    socket.on("createGame", (gameID) => {
        socket.join(gameID);
        console.log(socket.rooms);
    });
    socket.on("joinGame", (gameID) => {
        var _a;
        if (io.sockets.adapter.rooms.get(gameID) &&
            io.sockets.adapter.rooms.get(gameID).size < 2) {
            socket.join(gameID);
            socket.to(gameID).emit("joinedGame", `${socket.id} has joined the game`);
            console.log((_a = io.sockets.adapter.rooms.get(gameID)) === null || _a === void 0 ? void 0 : _a.entries());
        }
    });
    socket.on("piecemove", (move) => socket.to(move.gameID).emit("onpiecemoved", move));
    socket.on("pausegame", (gameID) => {
        socket.to(gameID).emit("pausegame");
    });
    socket.on("startgame", (gameID) => {
        socket.to(gameID).emit("startgame");
    });
});
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
