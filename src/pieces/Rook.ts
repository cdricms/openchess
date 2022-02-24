import Board from "../Board";
import { Shade } from "../common";
import Piece from "./Piece";

export default class Rook extends Piece {
  constructor(
    shade: Shade,
    board: Board,
    pos?: { rank: number; file: number }
  ) {
    super("Rook", shade, board, pos);
  }
}
