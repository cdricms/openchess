import Board from "../Board";
import { Shade } from "../common";
import Square from "../Square";
import Piece from "./Piece";

export default class Pawn extends Piece {
  constructor(
    shade: Shade,
    board: Board,
    pos?: { rank: number; file: number }
  ) {
    super("Pawn", shade, board, pos);
  }

  public getLegalMoves(board: Board) {
    const moves = this.getDefaultMoves(board);
    const lMoves: Square[] = [];
    moves.forEach((m) => {
      if (m && this.checkMoveLegality(m, () => this.moveConditions(m))) {
        lMoves.push(m);
      }
    });
    return lMoves;
  }

  protected moveConditions(m: Square): boolean {
    const sign = this.shade === "light" ? 1 : -1;
    if (
      m.pos.rank === this.pos?.rank! + sign ||
      m.pos.rank === this.pos?.rank! + sign * 2
    ) {
      if (
        (m.pos.rank !== this.pos?.rank! + sign * 2 &&
          m.pos.file === this.pos?.file! + sign) ||
        m.pos.file === this.pos?.file! - sign
      ) {
        return m.piece !== null && m.piece.shade !== this.shade;
      }

      return m.piece ? false : true;
    }

    return false;
  }

  public getDefaultMoves(board: Board) {
    const moves: Square[] = [];
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

      if (frontSquare && !frontSquare?.piece) {
        moves.push(frontSquare!);
      } // 1 square move
      if (this.timesMoved === 0 && front2Square && !front2Square?.piece) {
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
