import Board from "../Board";
import { Shade } from "../common";
import Square from "../Square";
import Piece from "./Piece";

export default class Pawn extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Pawn", shade, pos);
  }

  public getLegalMoves(board: Board) {
    const moves = this.getDefaultMoves(board);
    const lMoves: (Square | null)[] = [];
    moves.forEach((m) => {
      if (m && this.checkMoveLegality(m)) {
        lMoves.push(m);
      }
    });
    return lMoves;
  }

  public checkMoveLegality(move: Square) {
    let isLegal = false;
    if (!move.piece) {
      isLegal = true;
    } else {
      isLegal = false;
      if (move.piece.shade !== this.shade) {
        isLegal = true;
      } else {
        false;
      }
    }
    return isLegal;
  }

  public getDefaultMoves(board: Board) {
    const moves = [];
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
        moves.push(frontSquare);
      } // 1 square move
      if (this.timesMoved === 0 && !front2Square?.piece) {
        moves.push(front2Square);
      } // 2 square move
      if (upRightSqu) {
        moves.push(upRightSqu);
      }
      if (upLeftSquare) {
        moves.push(upLeftSquare);
      }
    }
    return moves;
  }
}
