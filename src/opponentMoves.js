// function to give us all moves the enemy can make
export function opponentMoves(board, turn, checkMove) {
  let moves = new Set()
  let movePositions = new Set()
  let turnColor = turn === "white" ? "black" : "white"

  board.forEach(currTile => {
    const piece = currTile.piece.type
    const color = currTile.piece.color === turnColor
    if (piece && color) {
      const pieceMoves = board.filter(newTile => {
        const newX = newTile.position.x
        const newY = newTile.position.y
        const position = `[${newX},${newY}]`
        return checkMove(currTile, newX, newY, board).includes(position)
      })
      moves = new Set([...moves, ...pieceMoves])
    }
  })

  moves.forEach(tile => {
    const x = tile.position.x
    const y = tile.position.y
    movePositions.add(`[${x},${y}]`)
  })

  return Array.from(movePositions)
}
