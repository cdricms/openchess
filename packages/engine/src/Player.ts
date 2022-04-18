import { Temporal } from "@js-temporal/polyfill";
import { v4 as uuidv4 } from "uuid";
import { Shade } from "./common.js";
import Game from "./Game.js";

export default class Player {
  shade: "dark" | "light";
  name: string = "Default Name";
  uuid = uuidv4();
  intervalID: number | null = null;
  isPaused: boolean = true;
  game: Game;
  currentTime = Temporal.Duration.from({ minutes: 30 });
  events: {
    ontimechanged: (player: Shade, time: Temporal.Duration) => void;
  } = {
    ontimechanged() {}
  };

  constructor(name: string, shade: "dark" | "light", game: Game) {
    this.shade = shade;
    this.name = name;
    this.game = game;
    this.currentTime = Temporal.Duration.from(this.game.initialTime);
  }

  start() {
    this.isPaused = false;
    this.intervalID = setInterval(() => {
      this.currentTime = this.currentTime.subtract({ seconds: 1 });
      this.events.ontimechanged(this.shade, this.currentTime);
    }, 1000) as unknown as number;
    return this;
  }

  pause() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.isPaused = true;
    }
    return this;
  }
}
