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
  #_fen: string;
  public pieces: Piece[] = [];
  public lightKing: King | null = null;
  public darkKing: King | null = null;
  public darkCoverage: Set<Square> = new Set();
  public lightCoverage: Set<Square> = new Set();
  public pieceHistory: Map<string, number> = new Map();
  public totalMoves = 0;
  public whoWon: Shade | null = null;
  public history: { uuid: string }[] = [];

  // The board is generated based on FEN: https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
  constructor(fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
    this.board = this.#generateBoard();
    this.#_fen = fen;
  }

  public get fen() {
    return this.#_fen;
  }

  public set fen(fen: string) {
    // To set a new FEN, we first check if the FEN is legal,
    // then empty the board
    // to load the new pieces position based on the new FEN
    if (this.legalFEN(fen)) {
      this.#_fen = fen;
      this.emptyBoard();
      this.loadPieces();
    }
  }

  public legalFEN(fen: string) {
    // A rank in chess means a horizontal column (a row)
    let rank = 0;
    let squares = 0;

    // Loop through every character in the fen
    for (const char of fen) {
      // Try to parse the character to a number
      const parsed = parseInt(char);
      // If the char is a "/" then it means this is a new rank, so increment it by one
      if (char === "/") {
        rank++;

        // if the character that has been parsed is not a number, then we increment squares by one
      } else if (isNaN(parsed)) {
        squares++;
        // if the character is indeed a number, then we sum the file with the parsed character
      } else {
        squares += parsed;
      }
    }

    // The FEN is legal only if there are 7 ranks (should be 8 but there is no "/" at the end)
    // And if the there 64 squares
    return rank === 7 && squares === 64;
  }

  public emptyBoard() {
    // To empty the board simply regenerate the board based on the FEN without any pieces.
    this.board = this.#generateBoard();
  }

  public loadPieces(fen?: string) {
    // A FEN can be passed through as argument, it will be changed only if it is legal.
    if (fen && this.legalFEN(fen)) {
      this.fen = fen;
    }

    // Start at board.length - 1 (7) because of the way a chess set is ordered,
    // (from white perspective) the top left corner is A8 and its corner is A1
    // In computer graphics (0;0) is the top left corner and not the bottom left, so we have to invert it.
    // This is one way of doing it.
    // Also the FEN also starts from A8, first character.
    let rank = this.board.length - 1;
    // File: 0 is column A
    let file = 0;
    let iFEN = 0;
    // current character of the fen.
    let char = "";

    // If rank reaches 0 and there are no characters left, then end the loop
    while (rank >= 0 && (char = this.fen[iFEN])) {
      // Parse the character to test later
      const parsed = parseInt(char);

      // If the character is a "/", it means that we need to decrement the rank by one.
      // And start back from the first column
      if (char === "/") {
        rank--;
        file = 0;

        // The character parsed is not a number, then we are in presence of a piece.
        // We need to determine which piece it is, and what shade it has.
        // if lower case: dark piece
        // if upper case: light piece
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

        // Associate to the corresponding square its piece, note that it can be null.
        this.board[rank][file].piece = piece;
        // If there is a piece
        // Associate to the piece its square coordinates
        if (piece) {
          piece.pos = this.board[rank][file].pos;
          // As an easy way of tracking every piece of the board, we store them into an array.
          this.pieces.push(piece);
          // Also keeping track of how many movements each piece has made.
          this.pieceHistory.set(piece.uuid, 0);
        }

        // We are now done with this piece, we can increment the file by one.
        file++;
      } else {
        // If the character is a number, it means that there are `parsed` empty squares.
        file += parsed;
      }
      // Increment the index of the FEN by one to get the next character.
      iFEN++;
    }

    // After all of this process is done, we need to scan the board and its pieces for their default and legal moves
    this.#scan();
  }

  public getKing(shade: Shade): King | null {
    // Based on the shade given we find the right King
    // By looping through each pieces
    const p = this.pieces.find(
      (p) => p.shade === shade && p.type === "King"
    ) as King | undefined;
    return p || null;
  }

  #scan() {
    // I would like to note that this algorithm is far from being perfect, and should actually be revisited to make it more accurate.
    // It could also be optimized, maybe by using a caching method. But not sure about that.

    // Each side has its own coverage of the board, meaning every square that is legal to them.
    // We need to clear each set of coverage every scan.
    this.lightCoverage.clear();
    this.darkCoverage.clear();
    // We also need to clear for each piece all of the attributes that were true in the last move of the game.
    this.pieces.forEach((p) => {
      p.threatenedBy.clear();
      p.threatens.clear();
      p.protects.clear();
      p.protectedBy.clear();
      p.myKingIsUnderCheck = false;
    });
    // When all of this is cleared, we can get the new values.
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

    // Set again the legal moves of each king.
    // And verify if they are under check.
    if (this.darkKing) {
      this.darkKing.legalMoves = this.darkKing.getLegalMoves(this);
      if (this.darkKing.isUnderCheck) {
        this.#signalKingUnderCheck(this.darkKing);
      }
    }
    if (this.lightKing) {
      this.lightKing.legalMoves = this.lightKing.getLegalMoves(this);
      if (this.lightKing.isUnderCheck) {
      }
      this.#signalKingUnderCheck(this.lightKing);
    }
    // If one side cannot move any piece then the adversary won.
    if (this.darkCoverage.size === 0) this.whoWon = "light";
    if (this.lightCoverage.size === 0) this.whoWon = "dark";
  }

  #signalKingUnderCheck(king: King) {
    // Get which we are talking about.
    const cov = king.shade === "dark" ? this.darkCoverage : this.lightCoverage;

    // Notify them that their King is under check, so they can find moves to protect him.
    this.pieces.forEach((p) => {
      if (p.shade === king.shade && p.type !== "King") {
        p.myKingIsUnderCheck = true;
        p.findMovesToProtectKing(this);
      }
    });
    // And update their coverage.
    cov.clear();
    this.pieces.forEach((p) => {
      if (p.shade === king.shade) {
        p.legalMoves.forEach((m) => {
          cov.add(m);
        });
      }
    });
  }

  public generateFEN() {
    // Generate the FEN based on the current state of the game.
    let fen = "";
    let count = 0;
    // Loop through each square
    this.forEach((square, rank, file) => {
      // If there is no square or the square doesn't have a piece, then we do nothing, only increment the count of emptiness
      if (!square || !square.piece) {
        count++;
      } else {
        // If there is a piece, we need to concatenate it to the fen string, and set it back to 0
        if (count > 0) {
          fen += count;
          count = 0;
        }
        // Then we can concatanate the piece fen character associated to it to the fen string.
        fen += square.piece.fenChar;
      }
      // If we reached the end of files
      if (file === this.board[rank].length - 1) {
        // And that the count of emptiness is > 0, then we need to concatenate it to the fen string, and set it back to 0
        if (count > 0) {
          fen += count;
          count = 0;
        }
        // And if the rank is not at the end we add a "/" to the fen string, to start a new rank.
        if (rank != 0) {
          fen += "/";
        }
      }
    });
    return fen;
  }

  #generateBoard() {
    // Initialize an array of 8 null elements
    const board: Square[][] = new Array(8).fill(new Array(8));

    // // And fill it with 8 new arrays of 8 null elements
    // for (let rank = 0; rank < board.length; rank++) board[rank] = new Array(8);

    // For each index, give them a square with the proper color.
    // Also starting from the end for the rank, for reasons explained at the top of the file.
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
    // Simple loop forEach with a callback
    for (let rank = this.board.length - 1; rank >= 0; rank--) {
      for (let file = 0; file < this.board[rank].length; file++) {
        callback(this.getSquare(rank, file), rank, file);
      }
    }
  }

  #isInRange(rank: number, file: number) {
    // Check if the file and rank given is in range
    return (
      0 <= rank &&
      rank < this.board.length &&
      0 <= file &&
      file < this.board[rank].length
    );
  }

  public setPiece(piece: Piece | null, rank: number, file: number) {
    // We first check if the coordinates given are legit.
    if (!this.#isInRange(rank, file)) return false;

    // Then we set the piece to its right square, and give the proper coordinates.
    this.board[rank][file].piece = piece;
    if (piece) piece.pos = this.board[rank][file].pos;

    // And generate a new fen.
    this.#_fen = this.generateFEN();

    return true;
  }

  public getPiece(rank: number, file: number) {
    const sqre = this.getSquare(rank, file);
    return sqre ? sqre.piece : null;
  }

  public getSquare(rank: number, file: number) {
    if (!this.#isInRange(rank, file)) return null;

    return this.board[rank][file];
  }

  public movePiece(dst: Position, piece: Piece | null) {
    if (piece) {
      piece.move(dst, this);
      this.#scan();
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
