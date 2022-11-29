import { Piece } from "./chess";

export function pieceFromNotation(notation: string): Piece {
  return Piece.PAWN;
}

/**
 * @param notation Text containing the name of the piece
 * */
export function pieceFromText(notation: string): Piece {
  notation = notation.toLocaleLowerCase();
  for(let piece in Object.keys(Piece)) {
    if(notation.includes(piece.toLocaleLowerCase())) {
      return piece as Piece;
    }
  }
  return Piece.PAWN;
}