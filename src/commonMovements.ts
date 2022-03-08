import Board from "./Board";
import { Position } from "./common";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";
import Square from "./Square";

export enum Direction {
  NORTH,
  NE,
  EAST,
  SE,
  SOUTH,
  SW,
  WEST,
  NW
}

export type DirectionString = keyof typeof Direction;

export function getDirection(direction: Direction): Position {
  switch (direction) {
    case Direction.NORTH:
      return { rank: 1, file: 0 };
    case Direction.NE:
      return { rank: 1, file: 1 };
    case Direction.EAST:
      return { rank: 0, file: 1 };
    case Direction.SE:
      return { rank: -1, file: 1 };
    case Direction.SOUTH:
      return { rank: -1, file: 0 };
    case Direction.SW:
      return { rank: -1, file: -1 };
    case Direction.WEST:
      return { rank: 0, file: -1 };
    case Direction.NW:
      return { rank: 1, file: -1 };
  }
}

export function diagonalMove(
  this: Queen | Bishop,
  direction: Direction.NE | Direction.SE | Direction.SW | Direction.NW,
  board: Board
): Square[] {
  return directionalMove(this, direction, board);
}
export function straightMove(
  this: Queen | Rook,
  direction:
    | Direction.NORTH
    | Direction.EAST
    | Direction.SOUTH
    | Direction.WEST,
  board: Board
) {
  return directionalMove(this, direction, board);
}

function directionalMove(
  piece: Queen | Bishop | Rook,
  direction: Direction,
  board: Board
) {
  const moves: Square[] = [];
  const d = getDirection(direction);
  let sqre: Square | null = board.getSquare(piece.pos?.rank!, piece.pos?.file!);
  // While there is a next square keep on getting.
  while (
    sqre &&
    (sqre = board.getSquare(sqre.pos.rank + d.rank, sqre.pos.file + d.file))
  ) {
    moves.push(sqre);
  }

  return moves;
}
