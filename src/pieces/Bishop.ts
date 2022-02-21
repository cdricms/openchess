import { Shade } from "../common";
import Piece from "./Piece";

export default class Bishop extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Bishop", shade, pos);
  }
}
