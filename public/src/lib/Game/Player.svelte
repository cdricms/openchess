<script lang="ts">
  import type { Player } from "@cdricms/engine";
  export let player: Player;

  $: time = player.currentTime;

  player.events.ontimechanged = (shade, _time) => {
    time = _time;
  };
</script>

<div id="player">
  {player.name}
  {`${time.minutes}:${time.seconds}`}
</div>
