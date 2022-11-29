import { pieceFromNotation } from "../notation";

test("Knight", () => {
  expect(pieceFromNotation("Knight")).toBe(1);
});
