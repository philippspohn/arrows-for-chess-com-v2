import { pieceFromNotation, pieceFromText } from "../chess/notation";
import { Piece } from "../chess/chess";
import { isUndefined } from "webpack-merge/dist/utils";

export enum Notation { FIGURINE, TEXT }
export interface MoveSuggestion {
  move: string
  piece: Piece
  notation: Notation
  eval: number
}

export function getEngineLines(): MoveSuggestion[] | null {
  let linesCompArray = document.querySelectorAll(".analysis-view-lines,.evaluation-lines-lines")
  if(linesCompArray == null || linesCompArray.length == 0) return null
  let allLinesComp = linesCompArray[0];

  let lineComps = allLinesComp.querySelectorAll(".engine-line-component,.evaluation-lines-component")
  if(lineComps.length == 0) return null
  let suggestions: MoveSuggestion[] = []
  for(let currentLine of lineComps) {
    // Evaluation
    let evaluation: number;
    let scoreTextArr = currentLine.querySelectorAll(".score-text-score,.evaluation-lines-score")
    if(scoreTextArr.length != 1) return null
    let scoreText = scoreTextArr[0].innerHTML;
    if(scoreText.includes("M")) {
      if(scoreText.trim().startsWith("+")) {
        evaluation = Number.POSITIVE_INFINITY;
      } else {
        evaluation = Number.NEGATIVE_INFINITY;
      }
    } else {
      try {
        evaluation = parseFloat(scoreText);
      } catch (e) {
        return null
      }
    }

    // Move Figurine
    if(currentLine.getElementsByClassName("move-san-component").length != 0) {
      let moveFigElms = currentLine.getElementsByClassName("move-san-component")[0].getElementsByClassName("move-san-figurine")
      if(moveFigElms.length > 0) {
        let piece = pieceFromText(moveFigElms[0].className)
        if(isUndefined(piece)) continue
        let moveTextElms = currentLine.getElementsByClassName("move-san-afterfigurine")
        if(moveTextElms.length > 0 && moveTextElms[0].innerHTML.trim() != "") {
          let move = moveTextElms[0].innerHTML;
          suggestions.push(<MoveSuggestion>{
            move,
            piece,
            eval: evaluation,
            notation: Notation.FIGURINE
          })
          continue
        }
      }
    }

    // Move Text
    let moveTextElms = currentLine.querySelectorAll(".move-san-san,.evaluation-lines-node")
    if(moveTextElms.length >0 && moveTextElms[0].innerHTML.trim() != "") {
      let move = moveTextElms[0].innerHTML;
      let piece = pieceFromNotation(move);
      if(isUndefined(piece)) continue
      suggestions.push(<MoveSuggestion>{
        move,
        piece,
        eval: evaluation,
        notation: Notation.TEXT
      })
    }


  }
  return suggestions.length == 0 ? null : suggestions
}