import Board from "../Board";
import { FENPieceNotation, PiecesUnicode, PieceType, Shade } from "../common";
import Square from "../Square";

export default class Piece {
  protected type: PieceType;
  readonly shade: Shade;
  pos?: { rank: number; file: number };
  readonly unicodeChar: PiecesUnicode;
  readonly fenChar: FENPieceNotation;
  timesMoved: number = 0;
  defaultMoves: Square[] = [];
  legalMoves: Square[] = [];

  protected constructor(
    type: PieceType,
    shade: Shade,
    board: Board,
    pos?: { rank: number; file: number }
  ) {
    this.type = type;
    this.shade = shade;
    this.pos = pos;
    const { unicode, fenChar } = this.getUnicodeAndFENChar();
    this.unicodeChar = unicode;
    this.fenChar = fenChar;
    this.defaultMoves = this.getDefaultMoves(board);
    this.legalMoves = this.getLegalMoves(board);
  }

  public getDefaultMoves(board: Board): Square[] {
    return [];
  }
  public getLegalMoves(board: Board): Square[] {
    return [];
  }
  protected moveConditions(m: Square): boolean {
    return false;
  }

  protected isMoveLegal(m: Square): boolean {
    return this.legalMoves.includes(m);
  }

  protected checkMoveLegality(move: Square, callback?: () => boolean) {
    let isLegal = false;
    if (!move.piece) {
      isLegal = true;
    } else {
      isLegal = false;
      if (move.piece.shade !== this.shade) {
        isLegal = true;
      } else {
        isLegal = false;
      }
    }

    if (callback) {
      isLegal = callback();
    }

    return isLegal;
  }

  private getUnicodeAndFENChar(): {
    unicode: PiecesUnicode;
    fenChar: FENPieceNotation;
  } {
    switch (this.shade) {
      case "dark":
        switch (this.type) {
          case "King":
            return { unicode: PiecesUnicode.DarkKing, fenChar: "k" };
          case "Queen":
            return { unicode: PiecesUnicode.DarkQueen, fenChar: "q" };
          case "Rook":
            return { unicode: PiecesUnicode.DarkRook, fenChar: "r" };
          case "Bishop":
            return { unicode: PiecesUnicode.DarkBishop, fenChar: "b" };
          case "Knight":
            return { unicode: PiecesUnicode.DarkKnight, fenChar: "n" };
          case "Pawn":
            return { unicode: PiecesUnicode.DarkPawn, fenChar: "p" };
        }
      case "light":
        switch (this.type) {
          case "King":
            return { unicode: PiecesUnicode.LightKing, fenChar: "K" };
          case "Queen":
            return { unicode: PiecesUnicode.LightQueen, fenChar: "Q" };
          case "Rook":
            return { unicode: PiecesUnicode.LightRook, fenChar: "R" };
          case "Bishop":
            return { unicode: PiecesUnicode.LightBishop, fenChar: "B" };
          case "Knight":
            return { unicode: PiecesUnicode.LightKnight, fenChar: "N" };
          case "Pawn":
            return { unicode: PiecesUnicode.LightPawn, fenChar: "P" };
        }
    }
  }

  public move(dst: { rank: number; file: number }, board: Board) {
    const s = board.getSquare(dst.rank, dst.file);
    if (!s) return;
    if (s && !this.isMoveLegal(s)) return;
    if (this.pos) board.setPiece(null, this.pos.rank, this.pos.file);
    const hasPiece = s?.piece;
    if (hasPiece && hasPiece.type != "King") {
      // Piece gets eaten
      board.setPiece(null, dst.rank, dst.file);
    }

    board.setPiece(this, dst.rank, dst.file);
    this.timesMoved++;
    this.defaultMoves = this.getDefaultMoves(board);
    this.legalMoves = this.getLegalMoves(board);
  }
}
