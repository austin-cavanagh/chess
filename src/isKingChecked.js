export function isKingChecked(opponentMovesState, kingTile) {
  return opponentMovesState.includes(kingTile.coordinates)
}
