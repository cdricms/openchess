import Board from "./Board";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const board = new Board();
board.loadPieces();
console.log(board.getPiece(0, 0));

board.displayInConsole();
