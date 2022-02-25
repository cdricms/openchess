import Board from "./Board";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const board = new Board();
board.loadPieces();
board.displayInConsole();
const knight = board.getPiece(0, 6);
console.table(knight?.legalMoves);
board.movePiece({ rank: 2, file: 7 }, knight);
board.movePiece({ rank: 3, file: 5 }, knight);
board.displayInConsole();
console.table(knight?.legalMoves);
board.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
board.displayInConsole();
