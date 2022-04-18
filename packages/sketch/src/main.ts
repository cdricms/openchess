import { Board, Piece, Square } from "@cdricms/engine";
import { Position } from "@cdricms/engine/src/common";
import p5 from "p5";

export const config = {
  canvasSize: 900,
  canvasParent: "app"
};
const table = document.getElementById("history");

const _sketch = (p5: p5) => {
  const board = new Board();
  let selectedSquare: Square | null = null;
  let draggingPiece = false;
  let inputFen = p5.createInput(board.fen, "text");
  inputFen.style("width", "100%");
  inputFen.elt.onchange = () => {
    const url = new URL(location.href);
    url.searchParams.set("fen", board.fen);
    history.replaceState("", "", url);
  };

  p5.setup = () => {
    const canvas = p5.createCanvas(config.canvasSize, config.canvasSize);
    canvas.parent(config.canvasParent);
    p5.background(0, 0, 0);
    const fen = new URL(location.href).searchParams.get("fen");
    board.loadPieces();
    if (fen) board.fen = fen;
    inputFen.elt.value = board.fen;
    //@ts-ignore
    inputFen.input((e) => {
      board.fen = e.target.value;
    });
    const resetBtn = p5.createButton("Reset FEN");
    resetBtn.mouseClicked(() => {
      board.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
      inputFen.elt.value = board.fen;
      inputFen.elt.onchange();
    });
  };

  const mapPosIntoCoords = (
    pos: Position,
    centered: boolean = false
  ): [number, number] => {
    const width = p5.width;
    const height = p5.height;
    const totalSquares = 8;

    let x = (pos.file * width) / totalSquares;
    // 0 becomes 7 and vice versa
    let y = ((pos.rank + 7 - pos.rank * 2) * height) / totalSquares;

    if (centered) {
      x += width / (totalSquares * 2);
      y += height / (totalSquares * 2);
    }

    return [x, y];
  };

  const drawPiece = (piece: Piece, coords?: { x: number; y: number }) => {
    if (piece.pos) {
      let x, y;
      if (coords) {
        x = coords.x;
        y = coords.y;
      } else {
        const [_x, _y] = mapPosIntoCoords(piece.pos, true);
        x = _x;
        y = _y;
      }
      p5.push();
      p5.fill(0, 0, 255);
      p5.textSize(50);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(piece.unicodeChar, x, y);
      p5.pop();
    }
  };

  const _drawSquareDefaultStyle = (
    x: number,
    y: number,
    color: [number, number, number],
    chessPos: { rank: number; file: string }
  ) => {
    p5.fill(...color);
    p5.square(x, y, p5.width / 8);
    p5.fill(255, 0, 0);
    p5.text(`${chessPos.file}${chessPos.rank}`, x, y + p5.height / 8);
  };

  const drawSquare = (
    square: Square,
    style: (
      x: number,
      y: number,
      color: [number, number, number],
      chessPos: { rank: number; file: string }
    ) => void = _drawSquareDefaultStyle
  ) => {
    const [x, y] = mapPosIntoCoords(square.pos);
    const color: [number, number, number] =
      square.shade === "dark" ? [0, 0, 0] : [255, 255, 255];
    const { rank, file } = square.chessPosition;
    p5.push();
    p5.noStroke();
    style(x, y, color, { rank, file });
    p5.pop();
  };

  const drawBoard = (board: Board) => {
    board.forEach((square) => {
      if (square) drawSquare(square);
    });
    if (selectedSquare && selectedSquare.piece) {
      drawSquare(selectedSquare, (x, y) => {
        p5.fill(0, 0, 120, 175);
        p5.square(x, y, p5.width / 8);
      });
      selectedSquare.piece.legalMoves.forEach((m) => {
        drawSquare(m, (x, y) => {
          p5.fill(0, 255, 0, 150);
          if (m.piece && !m.piece.canBeEaten) p5.fill(255, 0, 0, 150);
          p5.square(x, y, p5.width / 8);
        });
      });
    }
    board.pieces.forEach((piece) => {
      if (piece === selectedSquare?.piece && draggingPiece) {
        drawPiece(piece, { x: p5.mouseX, y: p5.mouseY });
      } else {
        drawPiece(piece);
      }
    });
  };

  const checkClick = (square: Square): [boolean, number, number] => {
    const [x, y] = mapPosIntoCoords(square.pos);
    return [
      p5.mouseX >= x &&
        p5.mouseX <= x + p5.width / 8 &&
        p5.mouseY >= y &&
        p5.mouseY <= y + p5.height / 8,
      x,
      y
    ];
  };

  const move = () => {
    selectedSquare?.piece?.legalMoves.forEach((m) => {
      const [c] = checkClick(m);
      if (c) {
        board.movePiece(m.pos, selectedSquare!.piece);
        selectedSquare = null;
        const tr = document.createElement("tr");
        const thAn = document.createElement("th");
        const thMove = document.createElement("th");
        thMove.textContent = board.history.length.toString();
        thAn.textContent = board.history[board.history.length - 1].an;
        tr.appendChild(thMove);
        tr.appendChild(thAn);
        table?.appendChild(tr);
        inputFen.elt.value = board.fen;
        inputFen.elt.onchange();
      }
    });
    board.forEach((square) => {
      if (square) {
        if (checkClick(square)[0]) {
          selectedSquare = square;
        }
      }
    });
  };

  p5.mousePressed = () => {
    switch (p5.mouseButton) {
      case p5.LEFT:
        move();
        break;
    }
  };

  // p5.mouseClicked = () => {
  //   console.log("cliked");
  //   move();
  // };

  p5.mouseDragged = () => {
    switch (p5.mouseButton) {
      case p5.LEFT:
        if (selectedSquare && selectedSquare.piece) {
          draggingPiece = true;
        } else {
          move();
        }
        break;
    }
  };

  p5.mouseReleased = () => {
    draggingPiece = false;
    if (selectedSquare) {
      move();
    }
  };

  p5.draw = () => {
    drawBoard(board);
    // p5.noLoop();
  };
};

const sketch = new p5(_sketch);
export default sketch;
