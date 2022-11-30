import { Piece } from "../chess/chess";

export function isFlipped(): boolean {
  return document.getElementsByClassName("flipped").length > 0;
}

export function isBottomsTurn(): boolean | null {
  let bottomWrapper = document.getElementsByClassName("board-layout-bottom");
  if (bottomWrapper == null || bottomWrapper.length == 0) return null;
  return bottomWrapper[0].getElementsByClassName("move-time-inactive").length == 0;
}

export function isWhitesTurn(): boolean | null {
  return isFlipped() != isBottomsTurn();
}

export function isBoardAvailable(): boolean {
  if (document.getElementsByClassName("board").length == 0) return false;
  if (document.getElementsByClassName("board-layout-bottom") == null) return false;
  return true;
}

// TODO getBoard & co

export interface SquareInfo {
  piece: Piece,
  isWhite: boolean
}

export function getBoard(): SquareInfo[][] | null {
  let pieceMap = new Array(8);
  for (let i = 0; i < pieceMap.length; i++) {
    pieceMap[i] = new Array(8);
  }
  const analysisBoardComp = document.getElementById("board-analysis-board") || document.getElementById("board-single");
  if (analysisBoardComp == null) return null;
  let children = analysisBoardComp.children;

  for (let child of children) {
    if (!child.classList) continue;
    let isPiece = false;
    let square = null;
    let piece = null;
    let isWhite = null;

    for (let cl of child.classList.values()) {
      if (cl === "piece") {
        isPiece = true;
      } else if (cl.includes("square-")) {
        square = cl.split("-")[1];
      } else if (cl.length == 2 && (cl.startsWith("w") || cl.startsWith("b"))) {
        piece = letterToPiece(cl.charAt(1));
        isWhite = cl.startsWith("w");
      }
    }

    if (!isPiece) {
      continue;
    }

    let translate = getTranslateXY(child);
    let posX = translate.translateX / child.getBoundingClientRect().width;
    let posY = 7 - (translate.translateY / child.getBoundingClientRect().height);
    if (isFlipped()) {
      posX = 7 - posX;
      posY = 7 - posY;
    }
    if (posX % 1 != 0 || posY % 1 != 0) continue;
    pieceMap[posX][posY] = { square, piece, isWhite };
  }

  return pieceMap;
}


function letterToPiece(letter: string) {
  switch (letter) {
    case "p":
      return Piece.Pawn;
    case "k":
      return Piece.King;
    case "q":
      return Piece.Queen;
    case "r":
      return Piece.Rook;
    case "n":
      return Piece.Knight;
    case "b":
      return Piece.Bishop;
  }
}

function getTranslateXY(element: Element) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    translateX: matrix.m41,
    translateY: matrix.m42
  };
}
