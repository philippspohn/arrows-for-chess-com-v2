import { isWhitesTurn } from "../scraper/board_state_scraper";

const ARROW_COLOR = "rgba(252, 186, 3, 0.75)";
const ARROW_SHORTEN_AMOUNT = 5;
const ARROW_WIDTH = 1.25;
const ARROW_HEIGHT = 2;

/* coordinates in relation to the chessboard, (0,0) being the a1 square */
export interface MoveCoordinates {
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  strength: number
}

export function removeArrows() {
  let arrowC = document.getElementById("arrow-component-afc");
  if (arrowC != null) arrowC.remove();
}

export function drawArrows(moves: MoveCoordinates[]) {
  let linesString = "";
  for (let m of moves) {
    linesString += arrowToSVGString(m, moves);
  }
  let fullString = `
  <defs>
    <marker id="arrowhead" markerWidth="${ARROW_WIDTH}" markerHeight="${ARROW_HEIGHT}" 
    refX="+0.01" refY="${ARROW_HEIGHT / 2}" orient="auto"
    fill="${ARROW_COLOR}"
    >
      <polygon points="0 0, ${ARROW_WIDTH} ${ARROW_HEIGHT / 2}, 0 ${ARROW_HEIGHT}" />
    </marker>
  </defs>
  ${linesString}
  `;
  let arrowComp: Element | null = document.getElementById("arrow-component-afc");
  if (arrowComp == null) arrowComp = addArrowContainer();
  if (arrowComp == null) return;
  arrowComp.innerHTML = fullString;
}

function addArrowContainer(): Element | null {
  const analysisBoardComp = document.getElementById("board-analysis-board");
  if (analysisBoardComp == null) return null;
  const newArrowContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  newArrowContainer.setAttribute("viewBox", "0 0 100 100");
  newArrowContainer.classList.add("arrows");
  newArrowContainer.id = "arrow-component-afc";
  analysisBoardComp.appendChild(newArrowContainer);
  return newArrowContainer;
}

function arrowToSVGString(move: MoveCoordinates, allMoves: MoveCoordinates[]) {
  let arrowStartX = move.startX * (100 / 8.0) + 6.25;
  let arrowStartY = 100 - move.startY * (100 / 8.0) - 6.25;
  let arrowEndX = move.endX * (100 / 8.0) + 6.25;
  let arrowEndY = 100 - move.endY * (100 / 8.0) - 6.25;
  let strokeWidth = calculateStrokeWidth(move, allMoves)

  let dx = arrowEndX - arrowStartX;
  let dy = arrowEndY - arrowStartY;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length > 0) {
    dx /= length;
    dy /= length;
  }
  const x3 = arrowStartX + dx * (length - ARROW_SHORTEN_AMOUNT);
  const y3 = arrowStartY + dy * (length - ARROW_SHORTEN_AMOUNT);

  return `<line x1="${arrowStartX}" y1="${arrowStartY}" x2="${x3}" y2="${y3}" stroke="${ARROW_COLOR}" stroke-width="${strokeWidth}" marker-end="url(#arrowhead)" />`;
}


// TODO update
function calculateStrokeWidth(move: MoveCoordinates, allMoves: MoveCoordinates[]): number {
  const isWhite = isWhitesTurn();
  const bestMoveStrength = allMoves.reduce(
    (acc: number, cur: MoveCoordinates) => isWhite ? Math.max(acc, cur.strength) : Math.min(acc, cur.strength),move.strength);
  const averageMoveStrengthAbs = Math.abs(
    allMoves.reduce((acc: number, cur: MoveCoordinates) => acc + cur.strength, 0)) / allMoves.length;

  let strengthDifference = Math.abs(bestMoveStrength - move.strength);
  strengthDifference *= 3; // amplify difference
  strengthDifference /= Math.max(1, averageMoveStrengthAbs / 3); // the strength differences become less siginficant if one player is clearly winning

  strengthDifference = Math.min(strengthDifference, 3);

  if (move.strength > 20 && !isWhite || move.strength < -20 && isWhite) move.strength = 3;

  return 4 - strengthDifference
}
