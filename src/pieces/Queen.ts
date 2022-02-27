import Board from "../Board";
import {
  getPathToEnemyKing,
  PathToEnemyKing,
  Position,
  Shade
} from "../common";
import { diagonalMove, Direction, straightMove } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class Queen extends Piece implements PathToEnemyKing {
  pathToEnemyKing: Square[] = [];
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

  public getPathToEnemyKing(board: Board, line: Square[]): Square[] {
    return [];
  }

  public getLegalMoves(board: Board): Square[] {
    const NORTH = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.straightMove(Direction.NORTH, board))
    );
    const EAST = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.straightMove(Direction.EAST, board))
    );
    const SOUTH = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.straightMove(Direction.SOUTH, board))
    );
    const WEST = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.straightMove(Direction.WEST, board))
    );
    const NE = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.diagonalMove(Direction.NE, board))
    );
    const SE = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.diagonalMove(Direction.SE, board))
    );
    const SW = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.diagonalMove(Direction.SW, board))
    );
    const NW = this.getPathToEnemyKing(
      board,
      this.checkMoveLegality(this.diagonalMove(Direction.NW, board))
    );

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
  getPathToEnemyKing
  // checkLegalMoves
});
