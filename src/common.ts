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
  DarkKing = "\u2654",
  DarkQueen = "\u2655",
  DarkRook = "\u2656",
  DarkBishop = "\u2657",
  DarkKnight = "\u2658",
  DarkPawn = "\u2659",

  LightKing = "\u265A",
  LightQueen = "\u265B",
  LightRook = "\u265C",
  LightBishop = "\u265D",
  LightKnight = "\u265E",
  LightPawn = "\u265F"
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

export function checkLegalMoves(this: Piece, line: Square[]) {
  const l: Square[] = [];
  for (const s of line) {
    if (!s.piece) {
      // /// May cause some bugs, need to be careful
      // s.isPinned = s.isPinned ? null : this.shade;
      l.push(s);
    } else if (s.piece.shade !== this.shade) {
      l.push(s);
      break;
    } else break;
  }

  return l;
}
