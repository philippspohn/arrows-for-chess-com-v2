export enum Piece {
  Pawn, Rook, Knight, Bishop, Queen, King
}

export function pieceFromLetter(letter: string): Piece | undefined {
  switch (letter) {
    case "R": return Piece.Rook
    case "N": return Piece.Knight
    case "B": return Piece.Bishop
    case "Q": return Piece.Queen
    case "K": return Piece.King
    default: return undefined
  }
}