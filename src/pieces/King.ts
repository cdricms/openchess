import Board from "../Board";
import { Position, Shade } from "../common";
import { Direction, DirectionString, getDirection } from "../commonMovements";
import Square from "../Square";
import Piece from "./Piece";

export default class King extends Piece {
  constructor(shade: Shade, board: Board, pos?: Position) {
    super("King", shade, board, pos);
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
