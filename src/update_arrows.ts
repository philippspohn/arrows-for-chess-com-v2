import { drawArrows, MoveCoordinates, removeArrows } from "./arrows/arrows";
import { getEngineLines, MoveSuggestion } from "./scraper/engine_line_scraper";
import { whereDoesMoveEnd, whereDoesMoveStart, BoardPosition } from "./chess/move";
import { isWhitesTurn } from "./scraper/board_state_scraper";

export function updateArrows() {
  let engineLines: MoveSuggestion[] | null = getEngineLines()
  if (engineLines == null) return;

  let arrows: MoveCoordinates[] = []
  let isWhite = isWhitesTurn()
  if(isWhite == null) return;

  for (let line of engineLines) {
    let startCoords: BoardPosition | null = whereDoesMoveStart(line.move, line.piece);
    let endCoords: BoardPosition | null = whereDoesMoveEnd(line.move);

    if (startCoords == null || endCoords == null) {
      removeArrows(); // TODO was hat es damit auf sich?
      continue;
    }

    arrows.push({
      startX: startCoords.fileIndex,
      startY: startCoords.rankIndex,
      endX: endCoords.fileIndex,
      endY: endCoords.rankIndex,
      strength: line.eval
    })
  }
  drawArrows(arrows);
}
