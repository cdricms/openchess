import Piece from "./pieces/Piece";
import Rook from "./pieces/Rook";
import Square from "./Square";
import { FENPieceNotation, Position, Shade } from "./common";
import Bishop from "./pieces/Bishop";
import King from "./pieces/King";
import Queen from "./pieces/Queen";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Pawn";

export default class Board {
  board: Square[][];
  private _fen: string;
  public pieces: Piece[] = [];
  public lightKing: King | null = null;
  public darkKing: King | null = null;
  public darkCoverage: Set<Square> = new Set();
  public lightCoverage: Set<Square> = new Set();
  public pieceHistory: Map<string, number> = new Map();

  constructor(fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
    this.board = this.generateBoard();
    this._fen = fen;
  }

  public get fen() {
    return this._fen;
  }

  public set fen(fen: string) {
    if (this.legalFEN(fen)) {
      this._fen = fen;
      this.emptyBoard();
      this.loadPieces();
    }
  }

  public legalFEN(fen: string) {
    let rank = 0;
    let file = 0;

    for (const char of fen) {
      const parsed = parseInt(char);
      if (char === "/") {
        rank++;
      } else if (isNaN(parsed)) {
        file++;
      } else {
        file += parsed;
      }
    }

    return rank === 7 && file === 64;
  }

  public emptyBoard() {
    this.board = this.generateBoard();
  }

  public loadPieces(fen?: string) {
    if (fen && this.legalFEN(fen)) {
      this.fen = fen;
    }
    let rank = this.board.length - 1;
    let file = 0;
    let iFEN = 0;
    let char = "";

    while (rank >= 0 && (char = this.fen[iFEN])) {
      const parsed = parseInt(char);

      if (char === "/") {
        rank--;
        file = 0;
      } else if (isNaN(parsed)) {
        let piece: Piece | null = null;
        switch (char as FENPieceNotation) {
          case "K":
            this.lightKing = piece = new King("light", this);
            break;
          case "k":
            this.darkKing = piece = new King("dark", this);
            break;
          case "Q":
          case "q":
            piece = new Queen(char === "q" ? "dark" : "light", this);
            break;
          case "R":
          case "r":
            piece = new Rook(char === "r" ? "dark" : "light", this);
            break;
          case "N":
          case "n":
            piece = new Knight(char === "n" ? "dark" : "light", this);
            break;
          case "B":
          case "b":
            piece = new Bishop(char === "b" ? "dark" : "light", this);
            break;
          case "P":
          case "p":
            piece = new Pawn(char === "p" ? "dark" : "light", this);
            break;
        }

        this.board[rank][file].piece = piece;
        if (piece) {
          piece.pos = this.board[rank][file].pos;
          this.pieces.push(piece);
          this.pieceHistory.set(piece.uuid, 0);
        }

        file++;
      } else {
        file += parsed;
      }
      iFEN++;
    }

    this.scan();
  }

  public getKing(shade: Shade): King | null {
    const p = this.pieces.find(
      (p) => p.shade === shade && p.type === "King"
    ) as King | undefined;
    return p ? p : null;
  }

  private scan() {
    this.lightCoverage.clear();
    this.darkCoverage.clear();
    this.pieces.forEach((p) => {
      p.threatenedBy.clear();
      p.threatens.clear();
      p.myKingIsUnderCheck = false;
    });
    this.pieces.forEach((p) => {
      p.defaultMoves = p.getDefaultMoves(this);
      p.legalMoves = p.getLegalMoves(this);
      p.threaten();
      if (p.shade === "light") {
        p.legalMoves.forEach((m) => this.lightCoverage.add(m));
      } else {
        p.legalMoves.forEach((m) => this.darkCoverage.add(m));
      }
    });

    if (this.darkKing) {
      this.darkKing.legalMoves = this.darkKing.getLegalMoves(this);
      if (this.darkKing.isUnderCheck) this.signalKingUnderCheck(this.darkKing);
    }
    if (this.lightKing) {
      this.lightKing.legalMoves = this.lightKing.getLegalMoves(this);
      if (this.lightKing.isUnderCheck)
        this.signalKingUnderCheck(this.lightKing);
    }
  }

  signalKingUnderCheck(king: King) {
    this.pieces.forEach((p) => {
      if (p.shade === king.shade && p.type !== "King") {
        p.myKingIsUnderCheck = true;
        p.findMovesToProtectKing(this);
      }
    });
  }

  public generateFEN() {
    let fen = "";
    let count = 0;
    this.forEach((square, rank, file) => {
      if (!square || !square.piece) {
        count++;
      } else {
        if (count > 0) {
          fen += count;
          count = 0;
        }
        fen += square.piece.fenChar;
      }
      if (file === this.board[rank].length - 1) {
        if (count > 0) {
          fen += count;
          count = 0;
        }
        if (rank != 0) {
          fen += "/";
        }
      }
    });
    return fen;
  }

  private generateBoard() {
    const board: Square[][] = new Array(8);
    for (let rank = 0; rank < board.length; rank++) board[rank] = new Array(8);

    for (let rank = board.length - 1; rank >= 0; rank--) {
      for (let file = 0; file < board[rank].length; file++) {
        board[rank][file] = new Square(
          (file + rank) % 2 === 1 ? "light" : "dark",
          { rank, file }
        );
      }
    }

    return board;
  }

  public forEach(
    callback: (square: Square | null, rank: number, file: number) => void
  ) {
    for (let rank = this.board.length - 1; rank >= 0; rank--) {
      for (let file = 0; file < this.board[rank].length; file++) {
        callback(this.getSquare(rank, file), rank, file);
      }
    }
  }

  private isInRange(file: number, rank: number) {
    return (
      0 <= rank &&
      rank < this.board.length &&
      0 <= file &&
      file < this.board[rank].length
    );
  }

  public setPiece(piece: Piece | null, rank: number, file: number) {
    if (!this.isInRange(rank, file)) return false;

    this.board[rank][file].piece = piece;
    if (piece) piece.pos = this.board[rank][file].pos;

    this._fen = this.generateFEN();

    return true;
  }

  public getPiece(rank: number, file: number) {
    const sqre = this.getSquare(rank, file);
    return sqre ? sqre.piece : null;
  }

  public getSquare(rank: number, file: number) {
    if (!this.isInRange(rank, file)) return null;

    return this.board[rank][file];
  }

  public movePiece(dst: Position, piece: Piece | null) {
    if (piece) {
      piece.move(dst, this);
      this.scan();
      // this.pieces.forEach((piece) => {
      //   piece.defaultMoves = piece.getDefaultMoves(this);
      //   piece.legalMoves = piece.getLegalMoves(this);
      // });
    }
  }

  public displayInConsole() {
    const vBar = "│";
    const tL = "  ┌───┬───┬───┬───┬───┬───┬───┬───┐";
    const mL = "  ├───┼───┼───┼───┼───┼───┼───┼───┤";
    const bL = "  └───┴───┴───┴───┴───┴───┴───┴───┘";
    const alphab = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let rank = this.board.length - 1; rank >= 0; rank--) {
      let line = `${rank + 1} ${vBar} `;
      for (let file = 0; file < this.board[rank].length; file++) {
        const piece = this.getPiece(rank, file);
        if (!piece) {
          line += " ";
        } else {
          line += piece.unicodeChar;
        }
        line += ` ${vBar} `;
      }
      if (rank === 7) console.log(tL);
      else console.log(mL);
      console.log(line);
      if (rank === 0) console.log(bL);
    }
    console.log(`  ${vBar} ` + alphab.join(` ${vBar} `) + ` ${vBar}`);
  }
}
