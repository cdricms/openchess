import Board from "../Board";
import { Shade } from "../common";
import { diagonalMovement, straightMovement } from "../commonMovements";
import Piece from "./Piece";

export default class Queen extends Piece {
  constructor(
    shade: Shade,
    board: Board,
    pos?: { rank: number; file: number }
  ) {
    super("Queen", shade, board, pos);
  }

  protected diagonalMovement() {}
  protected straightMovement() {}
}

Object.assign(Queen.prototype, diagonalMovement);
Object.assign(Queen.prototype, straightMovement);
