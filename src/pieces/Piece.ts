import { randomUUID } from "crypto";
import Board from "../Board";
import {
  FENPieceNotation,
  PathToEnemyKing,
  PiecesUnicode,
  PieceType,
  Position,
  Shade
} from "../common";
import Square from "../Square";

export default class Piece {
  readonly type: PieceType;
  readonly shade: Shade;
  pos?: Position;
  readonly unicodeChar: PiecesUnicode;
  readonly fenChar: FENPieceNotation;
  defaultMoves: Square[] = [];
  legalMoves: Square[] = [];
  threatens: Set<Piece> = new Set();
  threatenedBy: Set<Piece> = new Set();
  protects: Set<Piece> = new Set();
  readonly uuid = randomUUID();
  myKingIsUnderCheck: boolean = false;

  protected constructor(
    type: PieceType,
    shade: Shade,
    board: Board,
    pos?: Position
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

  public threaten() {
    this.legalMoves.forEach((m) => {
      if (m.piece && m.piece.shade !== this.shade) {
        this.threatens.add(m.piece);
        m.piece.threatenedBy.add(this);
      }
    });
  }

  public findMovesToProtectKing(board: Board) {
    const myKing = this.shade === "dark" ? board.darkKing : board.lightKing;
    if (myKing && myKing.threatenedBy.size <= 1) {
      for (const threat of myKing.threatenedBy) {
        if ("getPathToEnemyKing" in threat) {
          this.legalMoves = this.legalMoves.filter(
            (m) =>
              (threat as Piece & PathToEnemyKing).pathToEnemyKing.includes(m) ||
              (m.pos.rank === threat.pos?.rank &&
                m.pos.file === threat.pos.file)
          );
        }
      }
    } else {
      this.legalMoves = [];
    }
  }
  protected checkMoveLegality(
    move: Square,
    board?: Board,
    callback?: () => boolean
  ): boolean;
  protected checkMoveLegality(lines: Square[], board?: Board): Square[];

  protected checkMoveLegality(
    s: Square | Square[],
    board?: Board,
    callback?: () => boolean
  ) {
    if (s instanceof Square) {
      let isLegal = false;
      if (!s.piece) {
        isLegal = true;
      } else {
        isLegal = false;
        if (s.piece.shade !== this.shade) {
          isLegal = true;
        } else {
          isLegal = false;
          this.protects.add(s.piece);
        }
      }

      if (callback) {
        isLegal = callback();
      }

      return isLegal;
    } else {
      const l: Square[] = [];
      for (const _s of s) {
        if (!_s.piece) {
          l.push(_s);
        } else if (_s.piece.shade !== this.shade) {
          l.push(_s);
          break;
        } else {
          this.protects.add(_s.piece);
          break;
        }
      }
      return l;
    }
  }

  //   return isLegal;
  // }
  // protected checkMoveLegality(move: Square, callback?: () => boolean) {
  //   let isLegal = false;
  //   if (!move.piece) {
  //     isLegal = true;
  //   } else {
  //     isLegal = false;
  //     if (move.piece.shade !== this.shade) {
  //       isLegal = true;
  //     } else {
  //       isLegal = false;
  //       this.protects.add(move.piece);
  //     }
  //   }

  //   if (callback) {
  //     isLegal = callback();
  //   }

  //   return isLegal;
  // }

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

  public move(dst: Position, board: Board) {
    const s = board.getSquare(dst.rank, dst.file);
    if (!s) return;
    if (s && !this.isMoveLegal(s)) return;
    if (this.pos) board.setPiece(null, this.pos.rank, this.pos.file);
    const hasPiece = s?.piece;
    if (hasPiece && hasPiece.type !== "King") {
      // Piece gets eaten
      board.setPiece(null, dst.rank, dst.file);
    }

    board.setPiece(this, dst.rank, dst.file);
    let timesMoved = board.pieceHistory.get(this.uuid);
    board.pieceHistory.set(this.uuid, timesMoved! + 1);
  }
}
