export class Piece {
  protected type: PieceType;
  protected shade: Shade;
  square: Square | null;

  constructor(type: PieceType, shade: Shade, square: Square | null = null) {
    this.type = type;
    this.shade = shade;
    this.square = square;
  }

  public move(dst: { rank: number; file: number }, board: Board) {
    if (this.square)
      board.setPiece(null, this.square?.pos.rank, this.square?.pos.file);
    const hasPiece = board.getPiece(dst.rank, dst.file);
    if (hasPiece) {
      // Piece gets eaten
      board.setPiece(null, dst.rank, dst.file);
    }

    board.setPiece(this, dst.rank, dst.file);
  }
}
export class Pawn extends Piece {
  constructor(shade: Shade, square: Square | null = null) {
    super("Pawn", shade, square);
  }
}
export class Bishop extends Piece {
  constructor(shade: Shade, square: Square | null = null) {
    super("Bishop", shade, square);
  }
}
export class Knight extends Piece {
  constructor(shade: Shade, square: Square | null = null) {
    super("Knight", shade, square);
  }
}
export class Rook extends Piece {
  constructor(shade: Shade, square: Square | null = null) {
    super("Rook", shade, square);
  }
}
export class Queen extends Piece {
  constructor(shade: Shade, square: Square | null = null) {
    super("Queen", shade, square);
  }
}
export class King extends Piece {
  constructor(shade: Shade, square: Square | null = null) {
    super("King", shade, square);
  }
}

type Shade = "dark" | "light";
type PieceType = "Pawn" | "Bishop" | "Knight" | "Rook" | "Queen" | "King";

export class Square {
  piece: Piece | null = null;
  protected shade: Shade;
  public readonly pos: { rank: number; file: number };
  protected readonly chessPosition: { rank: number; file: string };

  constructor(shade: Shade, pos: { rank: number; file: number }) {
    this.shade = shade;
    this.pos = pos;
    this.chessPosition = this.getChessPosition();
  }

  private getChessPosition() {
    const alphab = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const letter = alphab[this.pos.file];
    return { rank: this.pos.rank, file: letter };
  }
}

export default class Board {
  board: Square[][];

  constructor() {
    this.board = this.generateBoard();
  }

  private generateBoard() {
    const board: Square[][] = new Array(8);
    for (let rank = 0; rank < board.length; rank++) board[rank] = new Array(8);

    for (let rank = 0; rank < board.length; rank++) {
      for (let file = 0; file < board[rank].length; file++) {
        board[rank][file] = new Square(
          (file + rank) % 2 === 0 ? "light" : "dark",
          { rank, file }
        );
      }
    }

    return board;
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
    if (piece) piece.square = this.board[rank][file];
    return true;
  }

  public getPiece(rank: number, file: number) {
    if (!this.isInRange(rank, file)) return null;

    return this.board[rank][file];
  }
}

const board = new Board();
const rook = new Rook("dark");
const bishop = new Bishop("light");
board.setPiece(rook, 0, 0);
board.setPiece(bishop, 5, 2);

console.log(board.getPiece(0, 0));
console.log(board.getPiece(5, 2));

bishop.move({ rank: 0, file: 0 }, board);
console.log(board.getPiece(0, 0));
console.log(board.getPiece(5, 2));
