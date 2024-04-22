import { leftCastle } from "./leftCastle"
import { rightCastle } from "./rightCastle"
import { kingCheckedIfMoved } from "./kingCheckedIfMoved"
import { isPiecePinned } from "./isPiecePinned"
import { opponentMoves } from "./opponentMoves"
import { isKingChecked } from "./isKingChecked"
import { movesWhenKingChecked } from "./movesWhenKingChecked"
import { movesIfCheckedIfMovedFunc } from "./movesIfCheckedIfMovedFunc"

import kingWhite from "./pieces/king_white.png"
import kingBlack from "./pieces/king_black.png"

// returns the valid moves for a selected piece
export function isValidMove(
  checkMove,
  boardArray,
  turn,
  origionalTile,
  inCheck,
  x,
  y,
  kingPosition,
  whiteLeftCastle,
  whiteRightCastle,
  blackLeftCastle,
  blackRightCastle,
  opponentMovesState
) {
  if (origionalTile.piece.color !== turn) return []

  let moves = []
  const pieceType = origionalTile.piece.type
  const origionalMoves = checkMove(origionalTile, x, y, boardArray)

  if (pieceType === "king") {
    let kingMoves = []
    // left castles
    if (leftCastle(boardArray, turn, opponentMovesState)) {
      if (whiteLeftCastle && origionalTile.coordinates === "[5,1]") {
        kingMoves.push("[3,1]")
      }
      if (blackLeftCastle && origionalTile.coordinates === "[5,8]") {
        kingMoves.push("[3,8]")
      }
    }

    // right castles
    if (rightCastle(boardArray, turn, opponentMovesState)) {
      if (whiteRightCastle && origionalTile.coordinates === "[5,1]") {
        kingMoves.push("[7,1]")
      }
      if (blackRightCastle && origionalTile.coordinates === "[5,8]") {
        kingMoves.push("[7,8]")
      }
    }

    // loop over the origionalMoves and check if the move is valid
    let newKingTile = undefined
    if (origionalMoves.length) {
      // create a new board with the king moved to the possible move
      origionalMoves.forEach(origionalMove => {
        const newBoard = boardArray.map(tile => {
          if (tile.coordinates === origionalMove) {
            newKingTile = tile
            return {
              ...tile,
              piece: {
                image: turn === "white" ? kingWhite : kingBlack,
                type: "king",
                color: turn,
              },
            }
          } else if (tile === origionalTile) {
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

        // find new attacks for the new board
        const newPossibleAttacks = opponentMoves(newBoard, turn, checkMove)

        // if king is not checked it is a valid move
        if (!isKingChecked(newPossibleAttacks, newKingTile)) {
          kingMoves.push(origionalMove)
        }
      })
    }

    return kingMoves
  }

  // after king move because i don't need to check for this if we are moving the king
  const isKingCheckedIfMoved = kingCheckedIfMoved(
    checkMove,
    boardArray,
    turn,
    origionalTile,
    kingPosition,
    opponentMovesState
  )

  // after king move because i don't need to check for this if we are moving the king
  const piecePinned = isPiecePinned(
    boardArray,
    origionalTile,
    turn,
    kingPosition,
    checkMove
  )

  if (inCheck && piecePinned) {
    moves = []
  } else if (inCheck) {
    moves = movesWhenKingChecked(
      checkMove,
      boardArray,
      turn,
      kingPosition
    ).filter(move => {
      return origionalMoves.includes(move)
    })

    return moves
  } else if (isKingCheckedIfMoved) {
    // if we are in check if we move the piece
    return movesIfCheckedIfMovedFunc(boardArray, origionalTile, turn).filter(
      move => {
        return origionalMoves.includes(move)
      }
    )
    // addes pieces
  } else {
    // if we aren't in check
    moves = origionalMoves
  }

  return moves
}
