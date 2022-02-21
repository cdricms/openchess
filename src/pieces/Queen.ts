import { Shade } from "../common";
import Piece from "./Piece";

export default class Queen extends Piece {
  constructor(shade: Shade, pos?: { rank: number; file: number }) {
    super("Queen", shade, pos);
  }
}
