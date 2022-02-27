import Board from "../Board";
import { Position, Shade } from "../common";
import { Direction, DirectionString, getDirection } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class King extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    super("King", shade, board, pos);
  }

  #isProtected(piece: Piece): boolean {
    return this.threatenedBy.has(piece) && piece.protectedBy.size > 0;
  }

  public getLegalMoves(board: Board): Square[] {
    const enCoverage =
      this.shade === "dark" ? board.lightCoverage : board.darkCoverage;
    const lMoves: Square[] = [];
    this.defaultMoves.forEach((m) => {
      if (
        m &&
        this.checkMoveLegality(m) &&
        !enCoverage.has(m) &&
        m.piece &&
        !this.#isProtected(m.piece)
      ) {
        lMoves.push(m);
      }
    });
    return lMoves;
  }

  public get isUnderCheck() {
    return this.threatenedBy.size > 0;
  }

  public getDefaultMoves(board: Board): Square[] {
    const moves: Square[] = [];
    const dir: DirectionString[] = [
      "NORTH",
      "NE",
      "EAST",
      "SE",
      "SOUTH",
      "SW",
      "WEST",
      "NW"
    ];
    for (let i = 0; i < 8; i++) {
      const d = getDirection(Direction[dir[i]]);
      const s = board.getSquare(
        this.pos?.rank! + d.rank,
        this.pos?.file! + d.file
      );
      if (s) moves.push(s);
    }

    /// Need to had the possibility to castle.

    return moves;
  }
}
