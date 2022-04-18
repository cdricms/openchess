<script lang="ts">
  import { config, _sketch, boardEvents } from "@cdricms/sketch/src/main";
  import p5 from "p5";
  import Game from "./lib/Game.svelte";

  const url = new URL(location.href);

  if (url.searchParams.get("fen"))
    config.game.board.fen = url.searchParams.get("fen");

  $: game = config.game;
  config.canvasParent = "game";
  config.canvasSize = 700;

  boardEvents.onpiecemove = (p, m, move) => {
    game = config.game;
  };

  const sketch = new p5(_sketch);
</script>

<main style="--game-height: {config.canvasSize}px">
  <Game {game} />
  <button on:click={(_) => (game.hasStarted = true)}>Start</button>
  <button on:click={(_) => (game.isPaused ? game.start() : game.pause())}
    >Pause</button
  >
  <!-- <input
    type="text"
    value={fen}
    on:input={(e) => {
      fen = e.currentTarget.value;
      game.board.fen = fen;
    }}
    on:change={(e) => {
      if (fen !== game.board.fen) fen = game.board.fen;
    }}
  /> -->
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
