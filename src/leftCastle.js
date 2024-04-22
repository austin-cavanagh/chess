import { isTileOccupied } from "./isTileOccupied"

export function leftCastle(boardArray, turn, opponentMovesState) {
  let canCastle = true

  const openTiles =
    turn === "white" ? ["[2,1]", "[3,1]", "[4,1]"] : ["[2,8]", "[3,8]", "[4,8]"]
  const opponentAttackedTiles =
    turn === "white"
      ? ["[1,1]", "[2,1]", "[3,1]", "[4,1]", "[5,1]"]
      : ["[1,8]", "[2,8]", "[3,8]", "[4,8]", "[5,8]"]

  // is any color on the tiles
  openTiles.forEach(tile => {
    // accessing the xy values in the string
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
