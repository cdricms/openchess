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
  fen: string;

  constructor(fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
    this.board = this.generateBoard();
    this.fen = fen;
  }

  public loadPieces() {
    const splitted = this.splitFEN();
    for (let rank = splitted.length - 1; rank >= 0; rank--) {
      for (let file = 0; file < splitted[rank].length; file++) {
        const value = splitted[rank][file];

        let piece: Piece | null = null;
        switch (value as FENPieceNotation) {
          case "K":
          case "k":
            piece = new King(value === "k" ? "dark" : "light");
            break;
          case "Q":
          case "q":
            piece = new Queen(value === "q" ? "dark" : "light");
            break;
          case "R":
          case "r":
            piece = new Rook(value === "q" ? "dark" : "light");
            break;
          case "N":
          case "n":
            piece = new Knight(value === "n" ? "dark" : "light");
            break;
          case "B":
          case "b":
            piece = new Bishop(value === "b" ? "dark" : "light");
            break;
          case "P":
          case "p":
            piece = new Pawn(value === "p" ? "dark" : "light");
            break;
        }

        this.setPiece(piece, rank, file);
      }
    }
  }

  public splitFEN() {
    const splitted: ((string | null)[] | string)[] = this.fen.split("/");
    for (let str = 0; str < splitted.length; str++) {
      const result = [];
      for (const char of splitted[str]!) {
        const parsed = parseInt(char as string);
        if (isNaN(parsed)) {
          result.push(char);
        } else {
          result.push(...Array(parsed).fill(null));
        }
      }
      splitted[str] = result;
    }
    return splitted;
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
        callback(this.getPiece(rank, file), rank, file);
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

    this.fen = this.generateFEN();

    return true;
  }

  public getPiece(rank: number, file: number) {
    if (!this.isInRange(rank, file)) return null;

    return this.board[rank][file];
  }

  public displayInConsole() {
    const alphab = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let rank = this.board.length - 1; rank >= 0; rank--) {
      let line = "|";
      for (let file = 0; file < this.board[rank].length; file++) {
        const s = this.getPiece(rank, file);
        if (!s?.piece) {
          line += " ";
        } else {
          line += s.piece.unicodeChar;
        }
        line += "|";
      }
      console.log("-".repeat(this.board.length * 2 + 1));
      console.log(line + (rank + 1));
    }
    console.log("|" + alphab.join("|") + "|");
  }
}
