import { Temporal } from "@js-temporal/polyfill";
import Board from "./Board.js";
import { Shade } from "./common.js";
import Player from "./Player.js";

export default class Game {
  board: Board;
  initialTime = Temporal.Duration.from({ minutes: 30 });
  light = new Player("light", "light", this);
  dark = new Player("dark", "dark", this);
  isPaused: boolean = false;
  hasStarted: boolean = false;
  currentPlayer: Player = this.light;
  events = {
    light: { ...this.light.events },
    dark: { ...this.dark.events }
  };
  whoWon: Shade | "draw" | null = null;

  constructor() {
    this.board = new Board();
    this.board.game = this;
  }

  addLightPlayer(name: string) {
    this.light.name = name;
    return this;
  }

  addDarkPlayer(name: string) {
    this.dark.name = name;
    return this;
  }

  start() {
    this.isPaused = false;
    this.hasStarted = true;
    this.currentPlayer.start();
    return this;
  }

  pause() {
    this.isPaused = true;
    this.light.pause();
    this.dark.pause();
    return this;
  }

  reset() {
    this.pause();
    return this;
  }

  switch() {
    this.currentPlayer.pause();
    this.currentPlayer =
      this.currentPlayer.shade === "dark" ? this.light : this.dark;
    this.currentPlayer.start();
  }
}
