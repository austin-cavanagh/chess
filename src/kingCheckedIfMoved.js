import { opponentMoves } from "./opponentMoves"
import { isKingChecked } from "./isKingChecked"

// checks if the king will be checned if we remove the piece
export function kingCheckedIfMoved(
  checkMove,
  boardArray,
  turn,
  origionalTile,
  kingPosition,
  opponentMovesState
) {
  // ignore the king
  if (origionalTile.piece.type === "king") {
    return false
  }

  // create a new board without the piece we are moving
  const newBoard = boardArray.map(tile => {
    if (tile === origionalTile) {
      return {
        ...tile,
        piece: { image: undefined, type: undefined, color: undefined },
      }
    } else {
      return tile
    }
  })

  // need to recalculate the possibleKingMoves to adjust for the piece not being there
  const newPossibleAttacks = opponentMoves(newBoard, turn, checkMove)

  // is king checked to start off with
  if (isKingChecked(opponentMovesState, kingPosition)) {
    return false
  }

  // otherwise
  return isKingChecked(newPossibleAttacks, kingPosition)
}
