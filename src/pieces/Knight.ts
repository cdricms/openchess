import { Shade } from "../common";
import Piece from "./Piece";

export default class Knight extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Knight", shade, pos);
  }
}
