import Board from "../Board.js";
import { Position, Shade } from "../common.js";
import Square from "../Square.js";
import Piece from "./Piece.js";

export default class Knight extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    const rank = shade === "dark" ? 7 : 0;
    const initSquares: Position[] = [
      { rank, file: 1 },
      { rank, file: 6 }
    ];
    super("Knight", shade, board, pos, initSquares);
  }

  public getDefaultMoves(board: Board): Square[] {
    const moves: Square[] = [];
    if (this.pos) {
      const p: Array<[number, number]> = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
      ];

      p.forEach((pos) => {
        const s = board.getSquare(
          this.pos!.rank + pos[0],
          this.pos!.file + pos[1]
        );
        if (s) moves.push(s);
      });
    }
    return moves;
  }
  public getLegalMoves(_: Board): Square[] {
    const moves = this.defaultMoves;
    const lMoves: Square[] = [];
    moves.forEach((m) => {
      if (m && this.checkMoveLegality(m)) lMoves.push(m);
    });

    return lMoves;
  }
}
