import { v4 as uuidv4 } from "uuid";
import Board from "../Board.js";
import {
  FENPieceNotation,
  PathToEnemyKing,
  PiecesUnicode,
  PieceType,
  Position,
  Shade
} from "../common.js";
import Square from "../Square.js";
import Pawn from "./Pawn.js";

export default class Piece {
  readonly type: PieceType;
  readonly shade: Shade;
  pos?: Position;
  readonly unicodeChar: PiecesUnicode;
  readonly fenChar: FENPieceNotation;
  defaultMoves: Square[] = [];
  legalMoves: Square[] = [];
  coverage: Square[] = [];
  threatens: Set<Piece> = new Set();
  threatenedBy: Set<Piece> = new Set();
  protects: Set<Piece> = new Set();
  protectedBy: Set<Piece> = new Set();
  readonly uuid = uuidv4();
  myKingIsUnderCheck: boolean = false;
  #_initialSquares: Position[] = [];
  timesMoved = 0;
  canBeEaten: boolean = true;

  protected constructor(
    type: PieceType,
    shade: Shade,
    board: Board,
    pos?: Position,
    initialSquares?: Position[]
  ) {
    this.type = type;
    this.shade = shade;
    this.pos = pos;
    const { unicode, fenChar } = this.#getUnicodeAndFENChar();
    this.unicodeChar = unicode;
    this.fenChar = fenChar;
    this.defaultMoves = this.getDefaultMoves(board);
    this.legalMoves = this.getLegalMoves(board);
    this.initialSquares = initialSquares || [];
  }

  protected get initialSquares() {
    return this.#_initialSquares;
  }

  protected set initialSquares(initialSquares: Position[]) {
    this.#_initialSquares = initialSquares;
  }

  public getDefaultMoves(board: Board): Square[] {
    return [];
  }
  public getLegalMoves(board: Board): Square[] {
    return [];
  }

  public getCoverageMoves(board: Board): Square[] {
    return this.legalMoves;
  }

  protected moveConditions(m: Square): boolean {
    return false;
  }

  protected isMoveLegal(m: Square): boolean {
    return this.legalMoves.includes(m);
  }

  public threaten() {
    // If a piece has in its legal moves an enemy, then it threatens, and notify the latter.
    this.coverage.forEach((m) => {
      if (m.piece && m.piece.shade !== this.shade) {
        this.threatens.add(m.piece);
        m.piece.threatenedBy.add(this);
      }
    });
  }

  public doIIntersect(): boolean {
    const threats = this.threatenedBy;
    for (const threat of threats) {
      if (
        threat.type === "Bishop" ||
        threat.type === "Queen" ||
        threat.type === "Rook"
      ) {
        const t = threat as Piece & PathToEnemyKing;
        for (const s of t.pathToEnemyKing) {
          if (s.piece === this) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // If its king is in check, it has to find the moves that could break that check.
  public findMovesToProtectKing(board: Board) {
    // Get its proper king.
    const myKing = this.shade === "dark" ? board.darkKing : board.lightKing;
    // The king has to be threatened only by one enemy, because a single move can not block two attacks on the king.
    if (myKing && myKing.threatenedBy.size <= 1) {
      // Get which squares that are available to it that could block the check.
      for (const threat of myKing.threatenedBy) {
        if ("getPathToEnemyKing" in threat) {
          this.legalMoves = this.legalMoves.filter(
            (m) =>
              (threat as Piece & PathToEnemyKing).pathToEnemyKing.includes(m) ||
              (m.pos.rank === threat.pos?.rank &&
                m.pos.file === threat.pos.file)
          );
        } else {
          this.legalMoves = this.legalMoves.filter(
            (m) =>
              m.pos.rank === threat.pos?.rank && m.pos.file === threat.pos.file
          );
        }
      }
    } else {
      // If none of these conditions meat, then it can't do anything.
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
    // This is an overloaded function, and deals with two types of cases.
    // The first case is if the piece can only move one by one (Pawn, King, Knight)
    if (s instanceof Square) {
      let isLegal = false;
      // If there is no piece, then the move is surely legal
      if (!s.piece) {
        isLegal = true;
      } else {
        isLegal = false;
        // If there is a piece, but it doesn't have the same color, then it is legal
        if (s.piece.shade !== this.shade) {
          isLegal = true;
        } else {
          // If they share the same color, then it protects the other piece.
          isLegal = false;
          this.protects.add(s.piece);
          s.piece.protectedBy.add(this);
        }
      }

      if (callback) {
        isLegal = callback();
      }

      return isLegal;
    } else {
      // The other case is for piece that go straight in a line or diagonally (Rook, Bishop, Queen)
      const l: Square[] = [];
      // For each piece, check:
      for (const _s of s) {
        // if the there is no piece, then we can add that to the final array
        if (!_s.piece) {
          l.push(_s);

          // If there is a piece but doesn't have the same color, then we add it and break.
        } else if (_s.piece.shade !== this.shade) {
          l.push(_s);
          break;
        } else {
          // If they share the same color, we only protect it and break.
          this.protects.add(_s.piece);
          _s.piece.protectedBy.add(this);
          break;
        }
      }
      return l;
    }
  }

  #getUnicodeAndFENChar(): {
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
    // Get the new square
    const s = board.getSquare(dst.rank, dst.file);
    // If it doesn't exist, then we simply return.
    if (!s) return;
    // Check if the move is legal, if not return.
    const hasPiece = s?.piece;
    if (s && !this.isMoveLegal(s)) return;
    if (hasPiece && !hasPiece?.canBeEaten) return;
    // Remove this piece from the current square
    if (this.pos) board.setPiece(null, this.pos.rank, this.pos.file);
    if (hasPiece && hasPiece.canBeEaten) {
      // Piece gets eaten
      const en = board.getPiece(dst.rank, dst.file);
      board.pieces = board.pieces.filter((p) => p !== en);
      board.setPiece(null, dst.rank, dst.file);
    }

    // En passant
    else if (this.type === "Pawn") {
      const sign = this.shade === "dark" ? -1 : 1;
      const pawn = this as unknown as Pawn;
      if (
        pawn.canTakeEnPassant?.pos?.file === dst.file &&
        pawn.canTakeEnPassant.pos.rank === dst.rank - sign
      ) {
        board.setPiece(
          null,
          pawn.canTakeEnPassant.pos.rank,
          pawn.canTakeEnPassant.pos.file
        );
        board.pieces = board.pieces.filter((p) => p !== pawn.canTakeEnPassant);
        pawn.canTakeEnPassant = null;
        pawn.timesEnPassant = pawn.timesEnPassant + 1;
      }
    }

    // Castle
    else if (this.type === "King" && this.timesMoved === 0) {
      const east = this.legalMoves.find(
        (move) =>
          move.pos.file === this.pos?.file! + 2 &&
          move.pos.rank === this.pos?.rank
      );
      const west = this.legalMoves.find(
        (move) =>
          move.pos.file === this.pos?.file! - 2 &&
          move.pos.rank === this.pos?.rank
      );
      if (east) {
        const rookEast = board.getPiece(this.pos?.rank!, this.pos?.file! + 3);
        if (rookEast) {
          board.setPiece(rookEast, this.pos?.rank!, this.pos?.file! + 1);
        }
      }
      if (west) {
        const rookWest = board.getPiece(this.pos?.rank!, this.pos?.file! - 4);
        board.setPiece(rookWest, this.pos?.rank!, this.pos?.file! - 1);
      }
    }

    // Set this piece to its new location.
    board.setPiece(this, dst.rank, dst.file);
    // Update the history of times moves
    this.timesMoved++;
    let timesMoved = board.pieceHistory.get(this.uuid);
    board.pieceHistory.set(this.uuid, timesMoved! + 1);
    board.totalMoves++;
    // Update the order.
    board.history.push({ uuid: this.uuid });
  }
}
