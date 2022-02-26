import Board from "../Board";
import { checkLegalMoves, Position, Shade } from "../common";
import { diagonalMove, Direction } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class Bishop extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    super("Bishop", shade, board, pos);
  }

  protected diagonalMove(
    direction: Direction.NE | Direction.SE | Direction.SW | Direction.NW,
    board: Board
  ): Square[] {
    return [];
  }

  protected checkLegalMoves(diagonal: Square[]): Square[] {
    return [];
  }

  public getLegalMoves(board: Board): Square[] {
    const NE = this.checkLegalMoves(this.diagonalMove(Direction.NE, board));
    const SE = this.checkLegalMoves(this.diagonalMove(Direction.SE, board));
    const SW = this.checkLegalMoves(this.diagonalMove(Direction.SW, board));
    const NW = this.checkLegalMoves(this.diagonalMove(Direction.NW, board));

    return [...NE, ...SE, ...SW, ...NW];
  }

  public getDefaultMoves(board: Board): Square[] {
    const NE = this.diagonalMove(Direction.NE, board);
    const SE = this.diagonalMove(Direction.SE, board);
    const SW = this.diagonalMove(Direction.SW, board);
    const NW = this.diagonalMove(Direction.NW, board);

    return [...NE, ...SE, ...SW, ...NW];
  }
}

Object.assign(Bishop.prototype, { diagonalMove, checkLegalMoves });
