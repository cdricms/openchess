import { Shade } from "../common";
import Piece from "./Piece";

export default class Rook extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Rook", shade, pos);
  }
}
