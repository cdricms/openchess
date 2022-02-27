import Board from "../Board";
import {
  getPathToEnemyKing,
  PathToEnemyKing,
  Position,
  Shade
} from "../common";
import { diagonalMove, Direction } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class Bishop extends Piece implements PathToEnemyKing {
  pathToEnemyKing: Square[] = [];
  constructor(shade: Shade, board: Board, pos?: Position) {
    super("Bishop", shade, board, pos);
  }
  getPathToEnemyKing(board: Board, line: Square[]): Square[] {
    return [];
  }

  protected diagonalMove(
    direction: Direction.NE | Direction.SE | Direction.SW | Direction.NW,
    board: Board
  ): Square[] {
    return [];
  }

  public getLegalMoves(board: Board): Square[] {
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

Object.assign(Bishop.prototype, { diagonalMove, getPathToEnemyKing });
