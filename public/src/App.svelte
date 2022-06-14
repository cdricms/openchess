<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import OnlineGame from "./routes/onlineGame.svelte";
  import OfflineGame from "./routes/offlineGame.svelte";
  import Home from "./routes/index.svelte";
  import { store } from "./store";
</script>

<Router>
  <div>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/game">
      {navigate("/", { replace: true })}
    </Route>
    <Route path="/game/offline">
      <OfflineGame />
    </Route>
    <Route path="/game/online">
      <OnlineGame />
    </Route>
  </div>
</Router>
