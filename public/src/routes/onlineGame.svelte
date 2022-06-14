<script lang="ts">
  import { config, _sketch, boardEvents } from "@cdricms/sketch/src/main";
  import p5 from "p5";
  import Game from "../lib/Game/Game.svelte";
  import { store, TStore } from "../store";

  let socket = $store.io;

  $: game = config.game;
  config.canvasParent = "game";
  console.log(config);
  config.canvasSize = 700;

  boardEvents.onpiecemove = (piece, current, previous, move) => {
    game = config.game;
    socket.emit("piecemove", {
      gameID: $store.id,
      fen: game.board.fen,
      current: { ...current, piece: null },
      previous: { ...previous, piece: null },
      move
    });
  };

  socket.on("onpiecemoved", ({ fen, current, previous }) => {
    const piece = game.board.getPiece(previous.pos.rank, previous.pos.file);

    console.log(piece);
    config.game.board.movePiece(current.pos, piece);
    game = config.game;
  });

  function pauseGame() {
    game.pause();
    socket.emit("pausegame", $store.id);
  }

  function startGame() {
    game.start();
    socket.emit("startgame", $store.id);
  }

  socket.on("pausegame", () => {
    game.pause();
  });

  socket.on("startgame", () => {
    game.start();
  });

  const sketch = new p5(_sketch);
</script>

<main style="--game-height: {config.canvasSize}px">
  <Game {game} />
  <button on:click={(_) => (game.hasStarted = true)}>Start</button>
  <button on:click={(_) => (game.isPaused ? startGame() : pauseGame())}
    >Pause</button
  >
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
