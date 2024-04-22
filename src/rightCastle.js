import { isTileOccupied } from "./isTileOccupied"

export function rightCastle(boardArray, turn, opponentMovesState) {
  let canCastle = true

  const openTiles = turn === "white" ? ["[6,1]", "[7,1]"] : ["[6,8]", "[7,8]"]
  const opponentAttackedTiles =
    turn === "white"
      ? ["[5,1]", "[6,1]", "[7,1]", "[8,1]"]
      : ["[5,8]", "[6,8]", "[7,8]", "[8,8]"]

  // is any color on the tiles
  openTiles.forEach(tile => {
    const x = tile[1]
    const y = tile[3]
    if (isTileOccupied(x, y, boardArray)) {
      canCastle = false
    }
  })

  // is the opponent attacking the tiles
  opponentAttackedTiles.forEach(tile => {
    if (opponentMovesState.includes(tile)) {
      canCastle = false
    }
  })

  return canCastle
}
