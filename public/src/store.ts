import { Writable, writable } from "svelte/store";
import { io } from "socket.io-client";

export const store: Writable<TStore> = writable({
  io: io("http://localhost:2000"),
  id: ""
});

export type TStore = {
  io: ReturnType<typeof io>;
  id: string;
};
