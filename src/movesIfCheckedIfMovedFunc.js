import { boardIndex } from "./boardIndex"

// checks for moves of non-king pieces when the king is checked
export function movesIfCheckedIfMovedFunc(boardArray, origionalTile, turn) {
  let attackDirection = undefined
  const tile = origionalTile.coordinates
  const removedBrackets = tile.slice(1, -1)
  const [strX, strY] = removedBrackets.split(",")
  const x = Number(strX)
  const y = Number(strY)

  const kingTile = boardArray.find(tile => {
    return tile.piece.color === turn && tile.piece.type === "king"
  }).coordinates
  const kingTileRemoveBrackets = kingTile.slice(1, -1)
  const [kingStrX, kingStrY] = kingTileRemoveBrackets.split(",")
  const kingX = Number(kingStrX)
  const kingY = Number(kingStrY)

  let yValue
  if (kingY - y === 0) {
    yValue = 0
  } else if (kingY - y < 0) {
    yValue = -1
  } else if (kingY - y > 0) {
    yValue = 1
  }

  let xValue
  if (kingX - x === 0) {
    xValue = 0
  } else if (kingX - x < 0) {
    xValue = -1
  } else if (kingX - x > 0) {
    xValue = 1
  }

  switch (`${yValue},${xValue}`) {
    case "-1,-1":
      attackDirection = { y: 1, x: 1 }
      break
    case "-1,0":
      attackDirection = { y: 1, x: 0 }
      break
    case "-1,1":
      attackDirection = { y: 1, x: -1 }
      break
    case "0,1":
      attackDirection = { y: 0, x: -1 }
      break
    case "1,1":
      attackDirection = { y: -1, x: -1 }
      break
    case "1,0":
      attackDirection = { y: -1, x: 0 }
      break
    case "1,-1":
      attackDirection = { y: -1, x: 1 }
      break
    case "0,-1":
      attackDirection = { y: 0, x: 1 }
      break
  }

  const availableMoves = []
  const opponentColor = turn === "white" ? "black" : "white"
  let reachedOpponentPiece = false
  let moves = 1
  while (!reachedOpponentPiece) {
    let newX = kingX + moves * attackDirection.x
    let newY = kingY + moves * attackDirection.y
    let position = `[${newX},${newY}]`
    availableMoves.push(position)

    const index = boardIndex[position]
    const currentTile = boardArray[index]

    if (currentTile.piece.color === opponentColor) {
      reachedOpponentPiece = true
    }

    moves++
  }

  return availableMoves
}
