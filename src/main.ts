import Board from "./Board";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const board = new Board();
board.loadPieces();
board.displayInConsole();
const pawn = board.getPiece(1, 7);
console.log(pawn?.getLegalMoves(board));
board.movePiece({ rank: 3, file: 7 }, pawn);
board.displayInConsole();
console.log(pawn?.getDefaultMoves(board));
board.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
board.displayInConsole();
