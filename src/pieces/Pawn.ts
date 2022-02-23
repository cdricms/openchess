import Board from "../Board";
import { Shade } from "../common";
import Piece from "./Piece";

export default class Pawn extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Pawn", shade, pos);
  }

  public getLegalMoves(board: Board) {
    if (this.pos) {
      const sign = this.shade === "light" ? 1 : -1;
      const frontSquare = board.getSquare(this.pos.rank + sign, this.pos.file);
      const front2Square = board.getSquare(
        this.pos.rank + sign * 2,
        this.pos.file
      );
      const upRightSqu = board.getSquare(
        this.pos.rank + sign,
        this.pos.file + sign
      );
      const upLeftSquare = board.getSquare(
        this.pos.rank + sign,
        this.pos.file - sign
      );

      if (!frontSquare?.piece) {
      } // 1 square move
      if (this.timesMoved === 0 && !front2Square?.piece) {
      } // 2 square move

      if (upRightSqu?.piece && upRightSqu.piece.shade !== this.shade) {
      }
      if (upLeftSquare?.piece && upLeftSquare.piece.shade !== this.shade) {
      }
    }
  }
}
