import Board from "../Board";
import { checkLegalMoves, Position, Shade } from "../common";
import { Direction, straightMove } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class Rook extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    super("Rook", shade, board, pos);
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

Object.assign(Rook.prototype, { straightMove, check: checkLegalMoves });
