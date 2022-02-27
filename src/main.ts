import Board from "./Board";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const board = new Board("rnb1kbnr/pppp1ppp/8/4Q3/4q3/8/PPPPPPPP/RNB1KBNR");
board.loadPieces();
board.displayInConsole();
const q = board.getPiece(4, 4);
const b = board.getPiece(7, 5);
const n = board.getPiece(7, 6);
if (q) {
  console.table((q as Queen).pathToEnemyKing);
}
console.table(q?.legalMoves);
console.table(b?.legalMoves);
console.table(n?.legalMoves);
console.table(board.getPiece(6, 0)?.legalMoves);
// console.table(pawn?.legalMoves);
// board.movePiece({ rank: 2, file: 0 }, pawn);
// console.table(pawn?.legalMoves);
