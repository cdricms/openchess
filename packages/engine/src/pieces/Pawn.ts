import Board from "../Board.js";
import { Position, Shade } from "../common.js";
import Square from "../Square.js";
import Piece from "./Piece.js";

export default class Pawn extends Piece {
  canTakeEnPassant: Pawn | null = null;
  timesEnPassant: number = 0;
  constructor(shade: Shade, board: Board, pos?: Position) {
    const rank = shade === "light" ? 1 : 6;
    const files: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

    const initSquares = files.map((file): Position => {
      return { rank, file };
    });

    super("Pawn", shade, board, pos, initSquares);
  }

  public getLegalMoves(_: Board) {
    const moves = this.defaultMoves;
    const lMoves: Square[] = [];
    moves.forEach((m) => {
      if (m && this.checkMoveLegality(m, _, () => this.moveConditions(m))) {
        lMoves.push(m);
      }
    });
    return lMoves;
  }

  protected moveConditions(m: Square): boolean {
    const sign = this.shade === "light" ? 1 : -1;

    if (this.canTakeEnPassant) {
      if (
        m.pos.rank - sign === this.canTakeEnPassant.pos?.rank &&
        m.pos.file === this.canTakeEnPassant.pos.file
      )
        return true;
    }

    // Check if it is the move in front of this pawn
    if (
      m.pos.rank === this.pos?.rank! + sign ||
      m.pos.rank === this.pos?.rank! + sign * 2
    ) {
      // Check if it the move on the sides but not the move 2 squares ahead.
      if (
        m.pos.rank !== this.pos?.rank! + sign * 2 &&
        (m.pos.file === this.pos?.file! + sign ||
          m.pos.file === this.pos?.file! - sign)
      ) {
        // return if there is a piece and the piece is an enemy
        return m.piece !== null && m.piece.shade !== this.shade;
      }

      // else if there is a piece, return false if ally.
      return m.piece ? false : true;
    }

    return false;
  }

  #isEnPassant(pawn: Pawn, board: Board) {
    if (
      pawn.timesMoved === 1 &&
      board.history[board.history.length - 1].uuid === pawn.uuid
    ) {
      this.canTakeEnPassant = pawn;
      console.log(pawn);
      return true;
    }
    return false;
  }

  public getCoverageMoves(board: Board): Square[] {
    const sign = this.shade === "light" ? 1 : -1;

    return this.defaultMoves.filter(
      (move) =>
        !(
          move.pos.file === this.pos?.file &&
          (move.pos.rank === this.pos?.rank + sign ||
            move.pos.rank === this.pos.rank + sign * 2)
        )
    );
  }

  public getDefaultMoves(board: Board) {
    const moves: Square[] = [];
    if (this.pos) {
      this.canTakeEnPassant = null;
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
        if (
          this.timesMoved === 0 &&
          this.initialSquares.find(
            (p) => p.rank === this.pos?.rank && p.file === this.pos?.file
          ) &&
          front2Square &&
          !front2Square?.piece
        ) {
          moves.push(front2Square);
        } // 2 square move
      } // 1 square move
      if (upRightSqu) {
        moves.push(upRightSqu);
      }
      if (upLeftSquare) {
        moves.push(upLeftSquare);
      }

      if (this.timesEnPassant === 0) {
        const right = board.getSquare(this.pos.rank, this.pos.file + sign);
        const left = board.getSquare(this.pos.rank, this.pos.file - sign);
        if (
          upRightSqu &&
          !upRightSqu.piece &&
          right &&
          right.piece instanceof Pawn &&
          this.#isEnPassant(right.piece, board)
        )
          if (!moves.includes(upRightSqu)) moves.push(upRightSqu);
        if (
          upLeftSquare &&
          !upLeftSquare.piece &&
          left &&
          left.piece instanceof Pawn &&
          this.#isEnPassant(left.piece, board)
        )
          if (!moves.includes(upLeftSquare)) moves.push(upLeftSquare);
      }
    }
    return moves;
  }
}
