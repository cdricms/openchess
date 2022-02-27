import Board from "./Board";
import Piece from "./pieces/Piece";
import Square from "./Square";

export interface Position {
  rank: number;
  file: number;
}

export type Shade = "dark" | "light";
export type PieceType =
  | "Pawn"
  | "Bishop"
  | "Knight"
  | "Rook"
  | "Queen"
  | "King";

export enum PiecesUnicode {
  LightKing = "\u2654",
  LightQueen = "\u2655",
  LightRook = "\u2656",
  LightBishop = "\u2657",
  LightKnight = "\u2658",
  LightPawn = "\u2659",

  DarkKing = "\u265A",
  DarkQueen = "\u265B",
  DarkRook = "\u265C",
  DarkBishop = "\u265D",
  DarkKnight = "\u265E",
  DarkPawn = "\u265F"
}

export type FENPieceNotation =
  | "p"
  | "r"
  | "n"
  | "b"
  | "q"
  | "k"
  | "P"
  | "R"
  | "N"
  | "B"
  | "Q"
  | "K";

export interface PathToEnemyKing {
  pathToEnemyKing: Square[];

  getPathToEnemyKing(board: Board, line: Square[]): Square[];
}

export function getPathToEnemyKing(
  this: Piece & PathToEnemyKing,
  board: Board,
  line: Square[]
): Square[] {
  const enemyKing = this.shade === "dark" ? board.lightKing : board.darkKing;
  if (enemyKing) {
    let isThere = false;
    for (const s of line) {
      if (s.piece?.uuid === enemyKing.uuid) {
        isThere = true;
        break;
      }
    }
    if (isThere) {
      this.pathToEnemyKing = line;
      console.log("hello");
    }
  }
  return line;
}

export type TPathToEnemyKing = keyof PathToEnemyKing;
