use chess_ai_engine::{Board, Shade};

fn main() {
    let board = Board::new("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");
    println!("{:?}", board);
    // let fen = generate_fen(board);
    // println!("{:?}", fen);
}
