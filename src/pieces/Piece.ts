import Board from "../Board";
import { FENPieceNotation, PiecesUnicode, PieceType, Shade } from "../common";

export default class Piece {
  protected type: PieceType;
  readonly shade: Shade;
  pos?: { rank: number; file: number };
  readonly unicodeChar: PiecesUnicode;
  readonly fenChar: FENPieceNotation;
  public timesMoved: number = 0;

  protected constructor(
    type: PieceType,
    shade: Shade,
    pos?: { rank: number; file: number }
  ) {
    this.type = type;
    this.shade = shade;
    this.pos = pos;
    const { unicode, fenChar } = this.getUnicodeAndFENChar();
    this.unicodeChar = unicode;
    this.fenChar = fenChar;
  }

  public getDefaultMoves(board: Board) {}
  public getLegalMoves(board: Board) {}

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
    if (this.pos) board.setPiece(null, this.pos.rank, this.pos.file);
    const hasPiece = board.getPiece(dst.rank, dst.file);
    if (hasPiece && hasPiece.type != "King") {
      // Piece gets eaten
      board.setPiece(null, dst.rank, dst.file);
    }

    board.setPiece(this, dst.rank, dst.file);
    this.timesMoved++;
  }
}
