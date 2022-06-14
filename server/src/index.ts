import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { Piece, Square } from "@cdricms/engine";

const app: Express = express();
const port = 2000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const publicPath = path.join(__dirname, "../../public/dist");

type PieceMove = {
  gameID: string;
  fen: string;
  current: Square;
  previous: Square;
  move: number;
};

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(`${publicPath}` + "/index.html");
});

io.on("connection", (socket) => {
  console.log(socket.rooms, socket.id);

  socket.on("createGame", (gameID: string) => {
    socket.join(gameID);
    console.log(socket.rooms);
  });

  socket.on("joinGame", (gameID: string) => {
    if (
      io.sockets.adapter.rooms.get(gameID) &&
      io.sockets.adapter.rooms.get(gameID)!.size < 2
    ) {
      socket.join(gameID);
      socket.to(gameID).emit("joinedGame", `${socket.id} has joined the game`);
      console.log(io.sockets.adapter.rooms.get(gameID)?.entries());
    }
  });

  socket.on("piecemove", (move: PieceMove) =>
    socket.to(move.gameID).emit("onpiecemoved", move)
  );

  socket.on("pausegame", (gameID: string) => {
    socket.to(gameID).emit("pausegame");
  });

  socket.on("startgame", (gameID: string) => {
    socket.to(gameID).emit("startgame");
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
