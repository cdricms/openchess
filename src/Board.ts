import Piece from "./pieces/Piece";
import Rook from "./pieces/Rook";
import Square from "./Square";
import { FENPieceNotation } from "./common";
import Bishop from "./pieces/Bishop";
import King from "./pieces/King";
import Queen from "./pieces/Queen";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Pawn";

export default class Board {
  board: Square[][];
  private _fen: string;

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
          case "k":
            piece = new King(char === "k" ? "dark" : "light");
            break;
          case "Q":
          case "q":
            piece = new Queen(char === "q" ? "dark" : "light");
            break;
          case "R":
          case "r":
            piece = new Rook(char === "r" ? "dark" : "light");
            break;
          case "N":
          case "n":
            piece = new Knight(char === "n" ? "dark" : "light");
            break;
          case "B":
          case "b":
            piece = new Bishop(char === "b" ? "dark" : "light");
            break;
          case "P":
          case "p":
            piece = new Pawn(char === "p" ? "dark" : "light");
            break;
        }

        this.board[rank][file].piece = piece;
        if (piece) piece.pos = this.board[rank][file].pos;

        file++;
      } else {
        file += parsed;
      }
      iFEN++;
    }
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

  public movePiece(dst: { rank: number; file: number }, piece: Piece | null) {
    if (piece) piece.move(dst, this);
  }

  public displayInConsole() {
    const alphab = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let rank = this.board.length - 1; rank >= 0; rank--) {
      let line = "|";
      for (let file = 0; file < this.board[rank].length; file++) {
        const piece = this.getPiece(rank, file);
        if (!piece) {
          line += " ";
        } else {
          line += piece.unicodeChar;
        }
        line += "|";
      }
      console.log("-".repeat(this.board.length * 2 + 1));
      console.log(line + (rank + 1));
    }
    console.log("|" + alphab.join("|") + "|");
  }
}
