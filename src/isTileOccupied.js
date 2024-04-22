import { boardIndex } from "./boardIndex"

export function isTileOccupied(x, y, board) {
  const position = `[${x},${y}]`
  const index = boardIndex[position]
  const tile = board[index]

  if (tile.piece.color) {
    return tile.piece.color
  } else {
    return false
  }
}
