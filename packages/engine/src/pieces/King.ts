import Board from "../Board.js";
import { PathToEnemyKing, Position, Shade } from "../common.js";
import {
  Direction,
  DirectionString,
  getDirection
} from "../commonMovements.js";
import Square from "../Square.js";
import Piece from "./Piece.js";

export default class King extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    const rank = shade === "dark" ? 7 : 0;
    const initSquares: Position[] = [{ rank, file: 4 }];
    super("King", shade, board, pos, initSquares);
    this.canBeEaten = false;
  }

  #isProtected(piece: Piece | null): boolean {
    if (piece) {
      return this.threatenedBy.has(piece) && piece.protectedBy.size > 0;
    }
    return false;
  }

  #isInScope(square: Square): boolean {
    for (const piece of this.threatenedBy) {
      if ("getPathToEnemyKing" in piece) {
        return (piece as Piece & PathToEnemyKing).pathToEnemyKing.includes(
          square
        );
      }
    }
    return false;
  }

  public getLegalMoves(board: Board): Square[] {
    const enCoverage =
      this.shade === "dark" ? board.lightCoverage : board.darkCoverage;
    const lMoves: Square[] = [];
    this.defaultMoves.forEach((m) => {
      if (
        // Check if this move is legal based on basic rules
        this.checkMoveLegality(m) &&
        // Check if this move is not covered by an enemy
        !enCoverage.has(m) &&
        // Check if this
        !this.#isProtected(m.piece) &&
        !this.#isInScope(m)
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

    /// Need to add the possibility to castle.

    return moves;
  }
}
