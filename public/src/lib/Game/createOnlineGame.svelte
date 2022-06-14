<script lang="ts">
  import { store } from "../../store";

  function generateID() {
    return (
      "game:" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
</script>

<div>
  <button
    on:click={() => {
      store.update((state) => ({ ...state, id: generateID() }));
      $store.io.emit("createGame", $store.id);
    }}
  >
    Create game
  </button>

  {$store.id}
</div>
