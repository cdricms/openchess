import Board from "../Board";
import { Shade } from "../common";
import Piece from "./Piece";

export default class Knight extends Piece {
  constructor(
    shade: Shade,
    board: Board,
    pos?: { rank: number; file: number }
  ) {
    super("Knight", shade, board, pos);
  }
}
