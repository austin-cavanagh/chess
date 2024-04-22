import pawnWhite from "./pieces/pawn_white.png"
import pawnBlack from "./pieces/pawn_black.png"

import { opponentMoves } from "./opponentMoves"
import { isKingChecked } from "./isKingChecked"

const boardIndex = {
  "[1,1]": 56,
  "[1,2]": 48,
  "[1,3]": 40,
  "[1,4]": 32,
  "[1,5]": 24,
  "[1,6]": 16,
  "[1,7]": 8,
  "[1,8]": 0,
  "[2,1]": 57,
  "[2,2]": 49,
  "[2,3]": 41,
  "[2,4]": 33,
  "[2,5]": 25,
  "[2,6]": 17,
  "[2,7]": 9,
  "[2,8]": 1,
  "[3,1]": 58,
  "[3,2]": 50,
  "[3,3]": 42,
  "[3,4]": 34,
  "[3,5]": 26,
  "[3,6]": 18,
  "[3,7]": 10,
  "[3,8]": 2,
  "[4,1]": 59,
  "[4,2]": 51,
  "[4,3]": 43,
  "[4,4]": 35,
  "[4,5]": 27,
  "[4,6]": 19,
  "[4,7]": 11,
  "[4,8]": 3,
  "[5,1]": 60,
  "[5,2]": 52,
  "[5,3]": 44,
  "[5,4]": 36,
  "[5,5]": 28,
  "[5,6]": 20,
  "[5,7]": 12,
  "[5,8]": 4,
  "[6,1]": 61,
  "[6,2]": 53,
  "[6,3]": 45,
  "[6,4]": 37,
  "[6,5]": 29,
  "[6,6]": 21,
  "[6,7]": 13,
  "[6,8]": 5,
  "[7,1]": 62,
  "[7,2]": 54,
  "[7,3]": 46,
  "[7,4]": 38,
  "[7,5]": 30,
  "[7,6]": 22,
  "[7,7]": 14,
  "[7,8]": 6,
  "[8,1]": 63,
  "[8,2]": 55,
  "[8,3]": 47,
  "[8,4]": 39,
  "[8,5]": 31,
  "[8,6]": 23,
  "[8,7]": 15,
  "[8,8]": 7,
}

// function to test if the king is already in check
// but the piece cannot move because it will check the king if they do
export function isPiecePinned(
  boardArray,
  origionalTile,
  turn,
  kingPosition,
  checkMove
) {
  if (origionalTile.piece.type === "king") {
    return
  }

  // determine the direction the pinned piece is in relation to the king
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

  const opponentColor = turn === "white" ? "black" : "white"

  // get location of tiles we will fill in with white pawns
  // allows us to test if the pinned piece will lead to check if removed
  const pawnPlaceholderTiles = openAndOpponentTilesAroundKing(
    boardArray,
    kingPosition,
    turn
  )

  // determine the tile we want to keep blank in the direction of attack
  const blankTile = `[${kingX + attackDirection.x},${
    kingY + attackDirection.y
  }]`

  // create new board with criteria above
  // remove any knights as they would break the test
  const newBoard = boardArray.map(tile => {
    if (
      origionalTile === tile ||
      blankTile === tile.coordinates ||
      (tile.piece.color === opponentColor && tile.piece.type === "knight")
    ) {
      return {
        ...tile,
        piece: {
          image: undefined,
          type: undefined,
          color: undefined,
        },
      }
    } else if (pawnPlaceholderTiles.includes(tile.coordinates)) {
      return {
        ...tile,
        piece: {
          image: turn === "white" ? pawnWhite : pawnBlack,
          type: "pawn",
          color: turn,
        },
      }
    } else {
      return tile
    }
  })

  const opponentMovesArray = opponentMoves(newBoard, turn, checkMove)

  return isKingChecked(opponentMovesArray, kingPosition)
}

// function is similar to another function but doesn't include opponent pieces
function openAndOpponentTilesAroundKing(board, kingPosition, turn) {
  let kingMoves = []
  const x = kingPosition.position.x
  const y = kingPosition.position.y

  const directions = [
    { dx: 1, dy: 1 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
  ]

  directions.forEach(direction => {
    let kingX = x
    let kingY = y

    kingX += direction.dx
    kingY += direction.dy
    const currentTile = `[${kingX},${kingY}]`

    const index = boardIndex[currentTile]
    const tileValue = board[index]

    if (
      !(kingX < 1 || kingX > 8 || kingY < 1 || kingY > 8) &&
      tileValue.piece.color !== turn
    ) {
      kingMoves.push(`[${kingX},${kingY}]`)
    }
  })

  return kingMoves
}
