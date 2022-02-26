import Board from "../Board";
import { checkLegalMoves, Position, Shade } from "../common";
import { diagonalMove, Direction, straightMove } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class Queen extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    super("Queen", shade, board, pos);
  }

  protected diagonalMove(
    direction: Direction.NE | Direction.SE | Direction.SW | Direction.NW,
    board: Board
  ): Square[] {
    return [];
  }

  protected straightMove(
    direction:
      | Direction.NORTH
      | Direction.EAST
      | Direction.SOUTH
      | Direction.WEST,
    board: Board
  ): Square[] {
    return [];
  }

  protected checkLegalMoves(line: Square[]): Square[] {
    return [];
  }

  public getLegalMoves(board: Board): Square[] {
    const NORTH = this.checkLegalMoves(
      this.straightMove(Direction.NORTH, board)
    );
    const EAST = this.checkLegalMoves(this.straightMove(Direction.EAST, board));
    const SOUTH = this.checkLegalMoves(
      this.straightMove(Direction.SOUTH, board)
    );
    const WEST = this.checkLegalMoves(this.straightMove(Direction.WEST, board));
    const NE = this.checkLegalMoves(this.diagonalMove(Direction.NE, board));
    const SE = this.checkLegalMoves(this.diagonalMove(Direction.SE, board));
    const SW = this.checkLegalMoves(this.diagonalMove(Direction.SW, board));
    const NW = this.checkLegalMoves(this.diagonalMove(Direction.NW, board));

    return [...NORTH, ...NE, ...EAST, ...SE, ...SOUTH, ...SW, ...WEST, ...NW];
  }

  public getDefaultMoves(board: Board): Square[] {
    const NORTH = this.straightMove(Direction.NORTH, board);
    const EAST = this.straightMove(Direction.EAST, board);
    const SOUTH = this.straightMove(Direction.SOUTH, board);
    const WEST = this.straightMove(Direction.WEST, board);
    const NE = this.diagonalMove(Direction.NE, board);
    const SE = this.diagonalMove(Direction.SE, board);
    const SW = this.diagonalMove(Direction.SW, board);
    const NW = this.diagonalMove(Direction.NW, board);

    return [...NORTH, ...NE, ...EAST, ...SE, ...SOUTH, ...SW, ...WEST, ...NW];
  }
}

Object.assign(Queen.prototype, {
  diagonalMove,
  straightMove,
  checkLegalMoves
});
