<script lang="ts">
  import type { Game } from "@cdricms/engine";
  import Player from "./Player.svelte";

  export let game: Game;
</script>

<section id="main">
  <div id="game-wrapper">
    <Player player={game.dark} />
    <div id="game" />
    <Player player={game.light} />
  </div>
  <div id="history">
    <table>
      <tr>
        <th>Num. of Moves</th>
        <th>Desc.</th>
      </tr>
      {#each game.board.history as m, i}
        <tr>
          <td>{i + 1}</td>
          <td>{m.an}</td>
        </tr>
      {/each}
    </table>
  </div>
</section>

<style>
  #main {
    display: flex;
  }
  #history > table {
    display: block;
    height: var(--game-height);
    max-height: var(--game-height);
    overflow-y: auto;
  }
  #game-wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
