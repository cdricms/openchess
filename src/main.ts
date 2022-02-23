import Board from "./Board";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const board = new Board();
board.loadPieces();
board.movePiece({ rank: 3, file: 7 }, board.getPiece(1, 7));
board.displayInConsole();
board.setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
board.displayInConsole();
