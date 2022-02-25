import Board from "../Board";
import { Shade } from "../common";
import Square from "../Square";
import Piece from "./Piece";

export default class Knight extends Piece {
  constructor(
    shade: Shade,
    board: Board,
    pos?: { rank: number; file: number }
  ) {
    super("Knight", shade, board, pos);
  }

  public getDefaultMoves(board: Board): Square[] {
    const moves: Square[] = [];
    if (this.pos) {
      // for (let i = 0; i < 4; i++) {
      //   const s1 = board.getSquare(this.pos.rank, this.pos.file);
      //   const s2 = board.getSquare(this.pos.rank, this.pos.file);
      //   if (s1) moves.push(s1);
      //   if (s2) moves.push(s2);
      // }

      /// THIS HAS TO BE BETTER

      const topRight = board.getSquare(this.pos.rank + 2, this.pos.file + 1);
      const topLeft = board.getSquare(this.pos.rank + 2, this.pos.file - 1);
      const bottomRight = board.getSquare(this.pos.rank - 2, this.pos.file + 1);
      const bottomLeft = board.getSquare(this.pos.rank - 2, this.pos.file - 1);
      const tR = board.getSquare(this.pos.rank + 1, this.pos.file + 2);
      const tL = board.getSquare(this.pos.rank + 1, this.pos.file - 2);
      const bR = board.getSquare(this.pos.rank - 1, this.pos.file + 2);
      const bL = board.getSquare(this.pos.rank - 1, this.pos.file - 2);

      if (topRight) moves.push(topRight);
      if (topLeft) moves.push(topLeft);
      if (bottomLeft) moves.push(bottomLeft);
      if (bottomRight) moves.push(bottomRight);
      if (tR) moves.push(tR);
      if (tL) moves.push(tL);
      if (bR) moves.push(bR);
      if (bL) moves.push(bL);
    }
    return moves;
  }
  public getLegalMoves(): Square[] {
    const moves = this.defaultMoves;
    const lMoves: Square[] = [];
    moves.forEach((m) => {
      if (m && this.checkMoveLegality(m)) lMoves.push(m);
    });

    return lMoves;
  }
}
