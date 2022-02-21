import { Shade } from "../common";
import Piece from "./Piece";

export default class Pawn extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Pawn", shade, pos);
  }
}
