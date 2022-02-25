import { Shade } from "./common";
import Piece from "./pieces/Piece";

export default class Square {
  piece: Piece | null = null;
  protected shade: Shade;
  public readonly pos: { rank: number; file: number };
  protected readonly chessPosition: { rank: number; file: string };
  public isPinned: Shade | null = null;

  constructor(shade: Shade, pos: { rank: number; file: number }) {
    this.shade = shade;
    this.pos = pos;
    this.chessPosition = this.getChessPosition();
  }

  private getChessPosition() {
    const alphab = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const letter = alphab[this.pos.file];
    return { rank: this.pos.rank + 1, file: letter };
  }
}
