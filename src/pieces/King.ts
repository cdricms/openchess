import { Shade } from "../common";
import Piece from "./Piece";

export default class King extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("King", shade, pos);
  }
}
