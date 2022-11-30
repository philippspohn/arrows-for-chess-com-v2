import { pieceFromNotation, pieceFromText } from "../chess/notation";
import { Piece } from "../chess/chess";

describe(pieceFromText, () => {
  test("Knight", () => {
    expect(pieceFromText("Knight")).toBe(Piece.Knight);
    expect(pieceFromText("white-knight")).toBe(Piece.Knight);
  });

  test("Pawn", () => {
    expect(pieceFromText("PAWN")).toBe(Piece.Pawn);
  });

  test("No Piece", () => {
    expect(pieceFromText("Some other text")).toBe(undefined);
  });
})

describe(pieceFromNotation, () => {
  test("Pawn", () => {
    expect(pieceFromNotation("e4")).toBe(Piece.Pawn);
    expect(pieceFromNotation("dxe4")).toBe(Piece.Pawn);
    expect(pieceFromNotation("dxe4+")).toBe(Piece.Pawn);
    expect(pieceFromNotation("e4+")).toBe(Piece.Pawn);
    expect(pieceFromNotation("e8=Q")).toBe(Piece.Pawn);
    expect(pieceFromNotation("e8=Q+")).toBe(Piece.Pawn);
    expect(pieceFromNotation("dxe8=Q+")).toBe(Piece.Pawn);
    expect(pieceFromNotation("e8#")).toBe(Piece.Pawn);
  })

  test("Knight", () => {
    expect(pieceFromNotation("Nf5")).toBe(Piece.Knight);
    expect(pieceFromNotation("Nxf5")).toBe(Piece.Knight);
    expect(pieceFromNotation("Nf5+")).toBe(Piece.Knight);
    expect(pieceFromNotation("Nxf5#")).toBe(Piece.Knight);
    expect(pieceFromNotation("Ndf5")).toBe(Piece.Knight);
    expect(pieceFromNotation("Ndxf5")).toBe(Piece.Knight);
  })

  test("Castles", () => {
    expect(pieceFromNotation("O-O-O")).toBe(Piece.King);
    expect(pieceFromNotation("O-O")).toBe(Piece.King);
    expect(pieceFromNotation("O-O+")).toBe(Piece.King);
  })

  test("Move Number", () => {
    expect(pieceFromNotation("6...a6")).toBe(Piece.Pawn);
    expect(pieceFromNotation("123.O-O-O")).toBe(Piece.King);
    expect(pieceFromNotation("8.Qa4")).toBe(Piece.Queen);
  })

  test("Queen", () => {
    expect(pieceFromNotation("Qd4xf6")).toBe(Piece.Queen);
  })
})