import Board from "./Board";
import Bishop from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const board = new Board("rnb1kbnr/pppppppp/8/8/3q4/8/PPPPPPPP/RNBQKBNR");
board.loadPieces();
board.displayInConsole();
// const pawn = board.getPiece(1, 4);
// const e = board.getPiece(6, 1);
// const rook = board.getPiece(3, 3);
// console.table(bishop?.legalMoves);
// board.movePiece({ rank: 2, file: 4 }, pawn);
// board.movePiece({ rank: 4, file: 1 }, e);
// console.table(rook?.legalMoves);
// // board.movePiece({ rank: 3, file: 5 }, knight);
// board.displayInConsole();
// // console.table(bishop?.defaultMoves);
// // board.fen = "rnbqkbnr/pppp1ppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
// board.displayInConsole();

const king = board.getPiece(7, 4);
console.log(king?.type);
console.table(king?.defaultMoves);
