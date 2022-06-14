<script lang="ts">
  import { store } from "../store";

  import CreateOnlineGame from "../lib/Game/createOnlineGame.svelte";
  import { navigate } from "svelte-navigator";
  const handleSingleplayer = () => {
    navigate("/game/offline", { replace: true });
  };

  $store.io.on("joinedGame", () => navigate("/game/online", { replace: true }));
</script>

<button on:click={handleSingleplayer}> Single Player </button>
<CreateOnlineGame />
<form
  on:submit={(e) => {
    e.preventDefault();
    $store.io.emit("joinGame", $store.id);
  }}
>
  <input type="text" bind:value={$store.id} />
  <button type="submit">Join</button>
</form>
