mod utils;

use core::panic;
use std::str::Split;

use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static TYPES: [PieceType; 6] = [
    PieceType::King,
    PieceType::Queen,
    PieceType::Rook,
    PieceType::Knight,
    PieceType::Bishop,
    PieceType::Pawn,
];
#[derive(Clone, Copy, Debug, PartialEq)]
enum PieceType {
    King,
    Queen,
    Rook,
    Bishop,
    Knight,
    Pawn,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Shade {
    Light,
    Dark,
}

#[derive(Clone, Copy, Debug)]
pub struct Piece {
    _typeof: PieceType,
    shade: Shade,
    fen_char: char,
    // moves: Vec<>
}

pub type BoardType = [[Option<Piece>; 8]; 8];

#[derive(Debug, Clone, Copy)]
struct NumberOf {
    pawns: u8,
    bishops: u8,
    knights: u8,
    rooks: u8,
    queens: u8,
    kings: u8,
}

impl NumberOf {
    pub fn new() -> NumberOf {
        NumberOf {
            pawns: 0,
            bishops: 0,
            knights: 0,
            rooks: 0,
            queens: 0,
            kings: 0,
        }
    }

    pub fn increment(&mut self, piece: Piece) {
        match piece._typeof {
            PieceType::Queen => {
                self.queens += 1;
            }
            PieceType::Rook => {
                self.rooks += 1;
            }
            PieceType::Bishop => {
                self.bishops += 1;
            }
            PieceType::Knight => self.knights += 1,
            PieceType::Pawn => self.pawns += 1,
            PieceType::King => self.kings += 1,
        };
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Board {
    board: BoardType,
    light: NumberOf,
    dark: NumberOf,
    turn: Shade,
}

impl Board {
    pub fn new(fen: &str) -> Board {
        let mut b = Board {
            board: Board::load_fen(fen),
            light: NumberOf::new(),
            dark: NumberOf::new(),
            turn: if Board::deconstruct_fen(fen).collect::<Vec<&str>>()[1] == "w" {
                Shade::Light
            } else {
                Shade::Dark
            },
        };
        for i in TYPES.into_iter().enumerate() {
            b.count(i.1, Shade::Dark);
            b.count(i.1, Shade::Light)
        }
        b
    }

    fn count(&mut self, _typeof: PieceType, shade: Shade) {
        for (_rank_idx, rank) in self.board.into_iter().enumerate() {
            for (_file_idx, square) in rank.into_iter().enumerate() {
                match square {
                    Some(piece) => {
                        if piece._typeof == _typeof && piece.shade == shade {
                            if piece.shade == Shade::Dark {
                                self.dark.increment(piece);
                            } else {
                                self.light.increment(piece);
                            };
                        }
                    }
                    None => continue,
                }
            }
        }
    }

    pub fn deconstruct_fen(fen: &str) -> Split<&str> {
        fen.split(" ")
    }

    pub fn load_fen(fen: &str) -> BoardType {
        let mut board: BoardType = [[None; 8]; 8];
        let mut rank = 7;
        let mut file = 0;
        let mut idx_fen: usize = 0;
        let mut total = 0;
        let _fen = fen.as_bytes();

        while total < 64 {
            let char = _fen[idx_fen] as char;

            if char == '/' {
                rank -= 1;
                file = 0;
            } else if !char.is_numeric() {
                let piece = match char {
                    'K' | 'k' => Piece {
                        _typeof: PieceType::King,
                        fen_char: char,
                        shade: if char.is_lowercase() {
                            Shade::Dark
                        } else {
                            Shade::Light
                        },
                    },
                    'Q' | 'q' => Piece {
                        _typeof: PieceType::Queen,
                        fen_char: char,
                        shade: if char.is_lowercase() {
                            Shade::Dark
                        } else {
                            Shade::Light
                        },
                    },
                    'R' | 'r' => Piece {
                        _typeof: PieceType::Rook,
                        fen_char: char,
                        shade: if char.is_lowercase() {
                            Shade::Dark
                        } else {
                            Shade::Light
                        },
                    },
                    'B' | 'b' => Piece {
                        _typeof: PieceType::Bishop,
                        fen_char: char,
                        shade: if char.is_lowercase() {
                            Shade::Dark
                        } else {
                            Shade::Light
                        },
                    },
                    'N' | 'n' => Piece {
                        _typeof: PieceType::Knight,
                        fen_char: char,
                        shade: if char.is_lowercase() {
                            Shade::Dark
                        } else {
                            Shade::Light
                        },
                    },
                    'P' | 'p' => Piece {
                        _typeof: PieceType::Pawn,
                        fen_char: char,
                        shade: if char.is_lowercase() {
                            Shade::Dark
                        } else {
                            Shade::Light
                        },
                    },
                    _ => panic!("Hello"),
                };
                board[rank][file] = Some(piece);
                file += 1;
                total += 1;
            } else {
                file += char.to_digit(10).unwrap() as usize;
                total += char.to_digit(10).unwrap() as usize;
            }
            idx_fen += 1;
        }

        return board;
    }

    pub fn generate_fen(board: BoardType) -> String {
        let mut fen = String::from("");
        let mut count = 0;
        let mut rank: i8 = 7;
        let mut _file = 0;

        while rank >= 0 {
            _file = 0;
            while _file <= 7 {
                let square = board[rank as usize][_file];
                if let None = square {
                    count += 1;
                } else {
                    let _square = square.unwrap();
                    if count > 0 {
                        fen = format!("{fen}{}", count.to_string());
                        count = 0;
                    }

                    fen.push(_square.fen_char);
                }
                if _file == board.len() - 1 {
                    if count > 0 {
                        fen = format!("{fen}{}", count.to_string());
                        count = 0;
                    }

                    if rank != 0 {
                        fen = format!("{fen}/");
                    }
                }
                _file += 1;
            }
            rank -= 1;
        }
        return fen;
    }

    pub fn evaluate(&self) -> i32 {
        let white_eval = self.count_material(Shade::Light);
        let dark_eval = self.count_material(Shade::Dark);

        let evaluation = white_eval - dark_eval;

        let perspective = if self.turn == Shade::Light { 1 } else { -1 };
        evaluation * perspective
    }

    pub fn count_material(&self, shade: Shade) -> i32 {
        fn increment_mat(nof: NumberOf) -> i32 {
            let mut material: i32 = 0;
            material += nof.bishops as i32 * BISHOP_WEIGHT;
            material += nof.knights as i32 * KNIGHT_WEIGHT;
            material += nof.rooks as i32 * ROOK_WEIGHT;
            material += nof.queens as i32 * QUEEN_WEIGHT;
            material += nof.pawns as i32 * PAWN_WEIGHT;

            material
        }

        match shade {
            Shade::Dark => increment_mat(self.dark),
            Shade::Light => increment_mat(self.light),
        }
    }
}

static KING_WEIGHT: i32 = 900;
static QUEEN_WEIGHT: i32 = 90;
static ROOK_WEIGHT: i32 = 50;
static KNIGHT_WEIGHT: i32 = 30;
static BISHOP_WEIGHT: i32 = 30;
static PAWN_WEIGHT: i32 = 10;

pub fn eval_weight(piece: Piece) -> i32 {
    let w = match piece._typeof {
        PieceType::King => KING_WEIGHT,
        PieceType::Queen => QUEEN_WEIGHT,
        PieceType::Rook => ROOK_WEIGHT,
        PieceType::Knight => KNIGHT_WEIGHT,
        PieceType::Bishop => BISHOP_WEIGHT,
        PieceType::Pawn => PAWN_WEIGHT,
    };

    match piece.shade {
        Shade::Dark => -w,
        Shade::Light => w,
    }
}

// pub fn minimax(node: Board, depth: u8, maximizing_player: bool) {
//     if depth == 0 {
//         return eval_weight(piece);
//     }
// }
