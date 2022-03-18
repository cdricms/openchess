import Board from "../Board";
import {
  getPathToEnemyKing,
  PathToEnemyKing,
  Position,
  Shade,
} from "../common";
import { Direction, straightMove } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class Rook extends Piece implements PathToEnemyKing {
  pathToEnemyKing: Square[] = [];
  constructor(shade: Shade, board: Board, pos?: Position) {
    const rank = shade === "dark" ? 7 : 0;
    const initSquares: Position[] = [
      { rank, file: 0 },
      { rank, file: 7 },
    ];
    super("Rook", shade, board, pos, initSquares);
  }
  getPathToEnemyKing(board: Board, line: Square[]): Square[] {
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

    return [...NORTH, ...EAST, ...SOUTH, ...WEST];
  }

  public getDefaultMoves(board: Board): Square[] {
    const NORTH = this.straightMove(Direction.NORTH, board);
    const EAST = this.straightMove(Direction.EAST, board);
    const SOUTH = this.straightMove(Direction.SOUTH, board);
    const WEST = this.straightMove(Direction.WEST, board);

    return [...NORTH, ...EAST, ...SOUTH, ...WEST];
  }
}

Object.assign(Rook.prototype, { straightMove, getPathToEnemyKing });
