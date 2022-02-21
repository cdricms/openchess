"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Piece = /** @class */ (function () {
    function Piece(type, shade, square) {
        if (square === void 0) { square = null; }
        this.type = type;
        this.shade = shade;
        this.square = square;
    }
    Piece.prototype.move = function (dst, board) {
        var _a, _b;
        if (this.square)
            board.setPiece(null, (_a = this.square) === null || _a === void 0 ? void 0 : _a.pos.rank, (_b = this.square) === null || _b === void 0 ? void 0 : _b.pos.file);
        var hasPiece = board.getPiece(dst.rank, dst.file);
        if (hasPiece) {
            // Piece gets eaten
            board.setPiece(null, dst.rank, dst.file);
        }
        board.setPiece(this, dst.rank, dst.file);
    };
    return Piece;
}());
exports.Piece = Piece;
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn(shade) {
        return _super.call(this, "Pawn", shade) || this;
    }
    return Pawn;
}(Piece));
exports.Pawn = Pawn;
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop(shade) {
        return _super.call(this, "Bishop", shade) || this;
    }
    return Bishop;
}(Piece));
exports.Bishop = Bishop;
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(shade) {
        return _super.call(this, "Knight", shade) || this;
    }
    return Knight;
}(Piece));
exports.Knight = Knight;
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook(shade) {
        return _super.call(this, "Rook", shade) || this;
    }
    return Rook;
}(Piece));
exports.Rook = Rook;
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(shade) {
        return _super.call(this, "Queen", shade) || this;
    }
    return Queen;
}(Piece));
exports.Queen = Queen;
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(shade) {
        return _super.call(this, "King", shade) || this;
    }
    return King;
}(Piece));
exports.King = King;
var Square = /** @class */ (function () {
    function Square(shade, pos) {
        this.piece = null;
        this.shade = shade;
        this.pos = pos;
        this.chessPosition = this.getChessPosition();
    }
    Square.prototype.getChessPosition = function () {
        var alphab = ["A", "B", "C", "D", "E", "F", "G", "H"];
        var letter = alphab[this.pos.file];
        return { rank: this.pos.rank, file: letter };
    };
    return Square;
}());
exports.Square = Square;
var Board = /** @class */ (function () {
    function Board() {
        this.board = this.generateBoard();
    }
    Board.prototype.generateBoard = function () {
        var board = new Array(8);
        for (var rank = 0; rank < board.length; rank++)
            board[rank] = new Array(8);
        for (var rank = 0; rank < board.length; rank++) {
            for (var file = 0; file < board[rank].length; file++) {
                board[rank][file] = new Square((file + rank) % 2 === 0 ? "light" : "dark", { rank: rank, file: file });
            }
        }
        return board;
    };
    Board.prototype.isInRange = function (file, rank) {
        return (0 <= rank &&
            rank < this.board.length &&
            0 <= file &&
            file < this.board[rank].length);
    };
    Board.prototype.setPiece = function (piece, rank, file) {
        if (!this.isInRange(rank, file))
            return false;
        this.board[rank][file].piece = piece;
        if (piece)
            piece.square = this.board[rank][file];
        return true;
    };
    Board.prototype.getPiece = function (rank, file) {
        if (!this.isInRange(rank, file))
            return null;
        return this.board[rank][file];
    };
    return Board;
}());
exports["default"] = Board;
var board = new Board();
var rook = new Rook("dark");
var bishop = new Bishop("light");
board.setPiece(rook, 0, 0);
board.setPiece(bishop, 5, 2);
console.log(board.getPiece(0, 0));
console.log(board.getPiece(5, 2));
bishop.move({ rank: 0, file: 0 }, board);
console.log(board.getPiece(0, 0));
console.log(board.getPiece(5, 2));
