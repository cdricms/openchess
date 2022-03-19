import { Position, Shade } from "./common.js";
import Piece from "./pieces/Piece.js";

export default class Square {
  piece: Piece | null = null;
  public shade: Shade;
  readonly pos: Position;
  readonly chessPosition: { rank: number; file: string };

  constructor(shade: Shade, pos: Position) {
    this.shade = shade;
    this.pos = pos;
    this.chessPosition = this.getChessPosition();
  }

  private getChessPosition() {
    // Get the right square position.
    const alphab = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const letter = alphab[this.pos.file];
    return { rank: this.pos.rank + 1, file: letter };
  }
}
