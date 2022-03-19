import Board from "../Board.js";
import {
  getPathToEnemyKing,
  PathToEnemyKing,
  Position,
  Shade
} from "../common.js";
import { diagonalMove, Direction, straightMove } from "../commonMovements.js";
import Square from "../Square.js";
import Piece from "./Piece.js";

export default class Queen extends Piece implements PathToEnemyKing {
  pathToEnemyKing: Square[] = [];
  constructor(shade: Shade, board: Board, pos?: Position) {
    const rank = shade === "dark" ? 7 : 0;
    const initSquare: Position[] = [{ rank, file: 3 }];
    super("Queen", shade, board, pos, initSquare);
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
    const NORTH = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.straightMove(Direction.NORTH, board)),
      board
    );
    const EAST = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.straightMove(Direction.EAST, board)),
      board
    );
    const SOUTH = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.straightMove(Direction.SOUTH, board)),
      board
    );
    const WEST = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.straightMove(Direction.WEST, board)),
      board
    );
    const NE = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.diagonalMove(Direction.NE, board)),
      board
    );
    const SE = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.diagonalMove(Direction.SE, board)),
      board
    );
    const SW = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.diagonalMove(Direction.SW, board)),
      board
    );
    const NW = this.checkMoveLegality(
      this.getPathToEnemyKing(board, this.diagonalMove(Direction.NW, board)),
      board
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
