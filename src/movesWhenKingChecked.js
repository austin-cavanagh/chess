import { isTileOccupied } from "./isTileOccupied"
import { isKingChecked } from "./isKingChecked"
import { opponentMoves } from "./opponentMoves"

import pawnWhite from "./pieces/pawn_white.png"
import pawnBlack from "./pieces/pawn_black.png"

import { boardIndex } from "./boardIndex"

// if the king is in check, we use that information to determine the moves for non-king pieces
// function will run anytime the king is in check, king moves are determined by another function
export function movesWhenKingChecked(checkMove, boardArray, turn, kingTile) {
  let attackDirection = undefined
  let oneAttack = false
  let oneAttackTile = undefined
  let knightOnlyAttack = false
  let knightOnlyAttackTile = undefined

  // find all open squares where the king can move
  // if the king is checked then he will be getting attacked from at LEAST one direction
  // if we have the checked squares we know squares that can be blocked
  let attackTiles = []
  const kingX = kingTile.position.x
  const kingY = kingTile.position.y
  const opponentColor = turn === "white" ? "black" : "white"

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
    const newKingX = kingX + direction.dx
    const newKingY = kingY + direction.dy
    const currTile = `[${newKingX},${newKingY}]`

    if (
      !(newKingX < 1 || newKingX > 8 || newKingY < 1 || newKingY > 8) &&
      !(isTileOccupied(newKingX, newKingY, boardArray) === turn)
    ) {
      attackTiles.push(currTile)

      // create a new board with a pawn placed on the direction of attack
      const newBoard = boardArray.map(tile => {
        if (tile.coordinates === currTile) {
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

      // now that we have the new board we need to recalculate the attacked squares
      const newPossibleAttacks = opponentMoves(newBoard, turn, checkMove)

      // if the king is no longer in check we know it is only attacked in one direction and know the direction
      if (!isKingChecked(newPossibleAttacks, kingTile)) {
        oneAttack = true
        oneAttackTile = currTile
        attackDirection = direction
      }
    }
  })

  // check if the attack is from a knight
  if (!oneAttack) {
    const knightTiles = []

    boardArray.forEach(tile => {
      if (tile.piece.type === "knight" && tile.piece.color === opponentColor) {
        knightTiles.push(tile.coordinates)
      }
    })

    // checking if the attack is coming from 1 or 2 knights
    knightTiles.forEach(knightTile => {
      const newBoard = boardArray.map(tile => {
        if (tile.coordinates === knightTile) {
          return {
            ...tile,
            piece: {
              image: undefined,
              type: undefined,
              color: undefined,
            },
          }
        } else {
          return tile
        }
      })
      // new possible moves
      const newPossibleAttacks = opponentMoves(newBoard, turn, checkMove)

      // if the king is no longer checked we know only 1 knight is attacking
      if (!isKingChecked(newPossibleAttacks, kingTile)) {
        knightOnlyAttack = true
        knightOnlyAttackTile = knightTile
        oneAttack = true
      }
    })
  }

  // this is what i will be returning
  const availableMoves = []
  // because only 1 person is attacking we can block their attack by placing a piece on them or in front of them
  // or by moving the kings, those are the only available moves
  if (oneAttack && !knightOnlyAttack) {
    let reachedOpponentPiece = false
    let moves = 1
    while (!reachedOpponentPiece) {
      let newX = kingX + moves * attackDirection.dx
      let newY = kingY + moves * attackDirection.dy
      let position = `[${newX},${newY}]`
      availableMoves.push(position)

      const index = boardIndex[position]
      const currentTile = boardArray[index]

      if (currentTile.piece.color === opponentColor) {
        reachedOpponentPiece = true
      }

      moves++
    }
  }

  if (knightOnlyAttack) {
    availableMoves.push(knightOnlyAttackTile)
  }

  return availableMoves
}
