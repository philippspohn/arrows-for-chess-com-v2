import { Piece, pieceFromLetter } from "./chess";

export function pieceFromNotation(notation: string): Piece | undefined {
  // Move number
  let m1 = new RegExp(/\d*\.*(.*)/).exec(notation);
  if(m1 == null || m1.length == 0) return undefined
  let nota = m1[1]; // notation without move nr

  // Castles
  if(nota.includes("O-O") || nota.includes("O-O-0")) return Piece.King

  // Other moves
  if(nota.charAt(0) == nota.charAt(0).toLocaleLowerCase()) {
    return Piece.Pawn;
  }
  return pieceFromLetter(nota.charAt(0))
}

/**
 * @param notation Text containing the name of the piece
 * */
export function pieceFromText(notation: string): Piece | undefined {
  for(let piece in Piece) {
    if(notation.toLocaleLowerCase().includes(piece.toLocaleLowerCase())) {
      return Piece[piece as keyof typeof Piece]
    }
  }
  return undefined
}