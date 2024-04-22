export function movePiece(event, boardRef, activePiece) {
  if (activePiece) {
    const boardElement = boardRef.current
    const minX = boardElement.offsetLeft
    const maxX = boardElement.offsetLeft + boardElement.offsetWidth - 90
    const minY = boardElement.offsetTop
    const maxY = boardElement.offsetTop + boardElement.offsetHeight - 90
    const x = event.clientX - 45
    const y = event.clientY - 45
    activePiece.style.position = "absolute"

    switch (true) {
      case x < minX:
        activePiece.style.left = `${minX}px`
        break
      case x > maxX:
        activePiece.style.left = `${maxX}px`
        break
      default:
        activePiece.style.left = `${x}px`
        break
    }

    switch (true) {
      case y < minY:
        activePiece.style.top = `${minY}px`
        break
      case y > maxY:
        activePiece.style.top = `${maxY}px`
        break
      default:
        activePiece.style.top = `${y}px`
        break
    }
  }
}
