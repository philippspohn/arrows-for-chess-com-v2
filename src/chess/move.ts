import { getBoard, isWhitesTurn, SquareInfo } from "../scraper/board_state_scraper";
import { Piece } from "./chess";

export interface BoardPosition {
  fileIndex: number,
  rankIndex: number
}

/**
 * @param move Move notation (e.g. "4.e4#", "Nxf5")
 * @return
 * */
export function whereDoesMoveEnd(move: string): BoardPosition {
  let isWhite = isWhitesTurn();
  // Castle
  if (move.includes("O-O-O")) {
    if (isWhite) return { fileIndex: 2, rankIndex: 0 };
    return { fileIndex: 2, rankIndex: 7 }
  } else if (move.includes("O-O")) {
    if (isWhite) return { fileIndex: 6, rankIndex: 0 };
    return { fileIndex: 6, rankIndex: 7 }
  }

  // Normal moves
  let boardPos = move.replace(/\W/g, "").slice(-2);
  let file = boardPos.charCodeAt(0);
  let fileIndex = file - "a".charCodeAt(0);
  let rank = parseInt(boardPos.charAt(1));
  let rankIndex = rank - 1;
  return { fileIndex, rankIndex };
}

function cleanupMoveName(move: string): string | null {
  // Check & Mate
  move = move.replace("#", "").replace("+", "")

  // MoveNr
  let match = /\d*\.*(.*)/.exec(move);
  if(match == null) return null;
  move = match[1]

  // Piece Name
  match = /[RNBQK]?(.*)/.exec(move);
  if(match == null) return null;
  move = match[1]
  return move
}

// TODO update
export function whereDoesMoveStart(move: string, piece: Piece): BoardPosition | null {
  let isWhite = isWhitesTurn();
  // Castle
  if (move.includes("O-O-O") || move.includes("O-O")) {
    if (isWhite) return { fileIndex: 4, rankIndex: 0 };
    return { fileIndex: 4, rankIndex: 7 }
  }

  // Normal moves
  let endPos = whereDoesMoveEnd(move);
  let x = endPos.fileIndex;
  let y = endPos.rankIndex;
  let potentialPositions = [];
  let boardRet = getBoard();
  if (boardRet == null) return null;
  let board: SquareInfo[][] = boardRet;

  console.log(board);

  let cleaned = cleanupMoveName(move)
  if(cleaned == null) return null;
  move = cleaned;


  function checkBoardFree(x: number, y: number) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return false;
    return !board[x][y];
  }

  function checkBoardPiece(x: number, y: number) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return false;
    if (!board[x][y]) return false;
    return (board[x][y].piece == piece && board[x][y].isWhite == isWhite);
  }


  // Calculate piece
  if (piece == Piece.Rook || piece == Piece.Queen) {
    // Nach links
    for (let i = x - 1; i >= 0; i--) {
      if (checkBoardPiece(i, y)) {
        potentialPositions.push([i, y]);
        break;
      } else if (!checkBoardFree(i, y)) {
        break;
      }
    }
    // Nach rechts
    for (let i = x + 1; i < 8; i++) {
      if (checkBoardPiece(i, y)) {
        potentialPositions.push([i, y]);
        break;
      } else if (!checkBoardFree(i, y)) {
        break;
      }
    }
    // Nach oben
    for (let i = y - 1; i >= 0; i--) {
      if (checkBoardPiece(x, i)) {
        potentialPositions.push([x, i]);
        break;
      } else if (!checkBoardFree(x, i)) {
        break;
      }
    }
    // Nach unten
    for (let i = y + 1; i < 8; i++) {
      if (checkBoardPiece(x, i)) {
        potentialPositions.push([x, i]);
        break;
      } else if (!checkBoardFree(x, i)) {
        break;
      }
    }
  }

  if (piece == Piece.Bishop || piece == Piece.Queen) {
    for (let d = 1; d < 8; d++) {
      let newX = x + d;
      let newY = y + d;
      if (newX < 0 || newY < 0 || newX >= 8 || newY >= 8) break;
      if (checkBoardPiece(newX, newY)) {
        potentialPositions.push([newX, newY]);
        break;
      } else if (!checkBoardFree(newX, newY)) {
        break;
      }
    }
    for (let d = 1; d < 8; d++) {
      let newX = x - d;
      let newY = y + d;
      if (newX < 0 || newY < 0 || newX >= 8 || newY >= 8) break;
      if (checkBoardPiece(newX, newY)) {
        potentialPositions.push([newX, newY]);
        break;
      } else if (!checkBoardFree(newX, newY)) {
        break;
      }
    }
    for (let d = 1; d < 8; d++) {
      let newX = x + d;
      let newY = y - d;
      if (newX < 0 || newY < 0 || newX >= 8 || newY >= 8) break;
      if (checkBoardPiece(newX, newY)) {
        potentialPositions.push([newX, newY]);
        break;
      } else if (!checkBoardFree(newX, newY)) {
        break;
      }
    }
    for (let d = 1; d < 8; d++) {
      let newX = x - d;
      let newY = y - d;
      if (newX < 0 || newY < 0 || newX >= 8 || newY >= 8) break;
      if (checkBoardPiece(newX, newY)) {
        potentialPositions.push([newX, newY]);
        break;
      } else if (!checkBoardFree(newX, newY)) {
        break;
      }
    }
  }

  if (piece == Piece.Pawn) {
    if (isWhite) {
      if (checkBoardPiece(x, y - 1)) {
        potentialPositions.push([x, y - 1]);
      } else if (checkBoardPiece(x, y - 2)) {
        potentialPositions.push([x, y - 2]);
      }
    } else {
      if (checkBoardPiece(x, y + 1)) {
        potentialPositions.push([x, y + 1]);
      } else if (checkBoardPiece(x, y + 2)) {
        potentialPositions.push([x, y + 2]);
      }
    }
  }

  if (piece == Piece.King) {
    for (let dX = -2; dX <= 2; dX++) { // +-3 wegen Casteln, kein Problem da nur ein König
      for (let dY = -1; dY <= 1; dY++) {
        if (dX == 0 && dY == 0) continue;
        if (checkBoardPiece(x + dX, y + dY)) {
          potentialPositions.push([x + dX, y + dY]);
        }
      }
    }
  }

  if (piece == Piece.Knight) {
    let dX = [2, 1, -1, -2, -2, -1, 1, 2];
    let dY = [1, 2, 2, 1, -1, -2, -2, -1];
    for (let i = 0; i < dX.length; i++) {
      if (checkBoardPiece(x + dX[i], y + dY[i])) {
        potentialPositions.push([x + dX[i], y + dY[i]]);
      }
    }
  }

  // Pawn takes
  if (move.includes("x") && piece == Piece.Pawn) {
    potentialPositions = [];
    if (isWhite) {
      if (checkBoardPiece(x - 1, y - 1)) potentialPositions.push([x - 1, y - 1]);
      if (checkBoardPiece(x + 1, y - 1)) potentialPositions.push([x + 1, y - 1]);
    } else {
      if (checkBoardPiece(x - 1, y + 1)) potentialPositions.push([x - 1, y + 1]);
      if (checkBoardPiece(x + 1, y + 1)) potentialPositions.push([x + 1, y + 1]);
    }
  }

  // Apply piece specifier
  if (move.length > 2 && (move.length > 3 || move.charAt(0) != "x")) {
    if (move.charCodeAt(0) >= "a".charCodeAt(0) && move.charCodeAt(0) <= "h".charCodeAt(0)) {
      let pieceSpecifierFileIndex = move.charCodeAt(0) - "a".charCodeAt(0);
      potentialPositions = potentialPositions.filter(p => p[0] == pieceSpecifierFileIndex);
    } else if (move.charCodeAt(0) >= "1".charCodeAt(0) && move.charCodeAt(0) <= "8".charCodeAt(0)) {
      let pieceSpecifierRankIndex = move.charCodeAt(0) - "1".charCodeAt(0);
      potentialPositions = potentialPositions.filter(p => p[1] == pieceSpecifierRankIndex);
    }
  }

  if (potentialPositions.length != 1) {
    console.log("Unexpected amount of potential positions:", move, piece, isWhite, potentialPositions.length, potentialPositions);
    return null;
  }
  return { fileIndex: potentialPositions[0][0], rankIndex: potentialPositions[0][1] };
}