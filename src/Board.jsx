import { useEffect, useRef, useState } from "react"
import pawnWhite from "./pieces/pawn_white.png"
import pawnBlack from "./pieces/pawn_black.png"
import knightWhite from "./pieces/knight_white.png"
import knightBlack from "./pieces/knight_black.png"
import bishopWhite from "./pieces/bishop_white.png"
import bishopBlack from "./pieces/bishop_black.png"
import rookWhite from "./pieces/rook_white.png"
import rookBlack from "./pieces/rook_black.png"
import queenWhite from "./pieces/queen_white.png"
import queenBlack from "./pieces/queen_black.png"
import kingWhite from "./pieces/king_white.png"
import kingBlack from "./pieces/king_black.png"

import { isTileOccupied } from "./isTileOccupied"
import {
  initialBoard,
  initialKingPosition,
  initialOpenTilesAroundKing,
  openTilesAroundKing as calculateOpenTilesAroundKing,
} from "./createBoard"
import { movePiece } from "./movePiece"
import { opponentMoves } from "./opponentMoves"
import { isKingChecked } from "./isKingChecked"
import { isValidMove } from "./isValidMove"
import { movesWhenKingChecked } from "./movesWhenKingChecked"
import { boardIndex } from "./boardIndex"

export function Board() {
  const [boardArray, setBoardArray] = useState(initialBoard)
  const [activePiece, setActivePiece] = useState(null)
  // tracks past player moves
  const [moves, setMoves] = useState([])
  const [turn, setTurn] = useState("white")
  const [showMoves, setShowMoves] = useState([])
  // squares the other team is attacking
  const [possibleKingAttacks, setPossibleKingAttacks] = useState([])
  const [inCheck, setInCheck] = useState(false)
  const [kingPosition, setKingPosition] = useState(initialKingPosition)

  const [whiteLeftCastle, setWhiteLeftCastle] = useState(true)
  const [whiteRightCastle, setWhiteRightCastle] = useState(true)

  const [blackLeftCastle, setBlackLeftCastle] = useState(true)
  const [blackRightCastle, setBlackRightCastle] = useState(true)

  const [opponentMovesState, setOpponentMovesState] = useState([])
  const [checkmate, setCheckmate] = useState(false)
  const [draw, setDraw] = useState(false)

  // will store the moves available on a given turn stored in an object
  const [possibleMoves, setPossibleMoves] = useState({})

  // hold the tile where en passant is possible
  const [enPassant, setEnPassant] = useState({ x: undefined, y: undefined })

  const boardRef = useRef(null)

  useEffect(() => {
    setOpponentMovesState(() => {
      return opponentMoves(boardArray, turn, checkMove)
    })
  }, [boardArray])

  // i think this will be dependent on the inCheck becasue it will change
  useEffect(() => {
    setPossibleKingAttacks(() => {
      const newTurn = turn === "white" ? "black" : "white"
      return opponentMoves(boardArray, newTurn, checkMove)
    })
  }, [opponentMovesState])

  useEffect(() => {
    setKingPosition(() => {
      const kingTile = boardArray.find(tile => {
        return tile.piece.type === "king" && tile.piece.color === turn
      })
      return kingTile
    })
  }, [possibleKingAttacks])

  useEffect(() => {
    setInCheck(() => {
      return [isKingChecked(opponentMovesState, kingPosition)]
    })
  }, [kingPosition])

  useEffect(() => {
    setPossibleMoves(() => {
      const moves = {}

      for (let tile of boardArray) {
        const newX = tile.position.x
        const newY = tile.position.y

        const validMoves = isValidMove(
          checkMove,
          boardArray,
          turn,
          tile,
          inCheck[0],
          newX,
          newY,
          kingPosition,
          whiteLeftCastle,
          whiteRightCastle,
          blackLeftCastle,
          blackRightCastle,
          opponentMovesState
        )

        moves[tile.coordinates] = validMoves
      }

      return moves
    })
  }, [inCheck])

  // updating checkmate variable
  useEffect(() => {
    // compiling all possible moves, if no moves are possible it is checkmate
    setCheckmate(() => {
      let moves = []

      Object.values(possibleMoves).forEach(currentMoves => {
        moves = [...moves, ...currentMoves]
      })

      return moves.length === 0 && inCheck[0]
    })

    setDraw(() => {
      let moves = []

      Object.values(possibleMoves).forEach(currentMoves => {
        moves = [...moves, ...currentMoves]
      })

      return moves.length === 0 && !inCheck[0]
    })
  }, [possibleMoves])

  function grabPiece(event, tile) {
    const element = event.target
    setActivePiece(element)

    const x = event.clientX - 45
    const y = event.clientY - 45
    element.style.position = "absolute"
    element.style.left = `${x}px`
    element.style.top = `${y}px`

    element.style.zIndex = "999"

    setShowMoves(() => {
      return boardArray.filter(currTile => {
        const newX = currTile.position.x
        const newY = currTile.position.y
        const position = `[${newX},${newY}]`

        return possibleMoves[tile.coordinates].includes(position)
      })
    })
  }

  function dropPiece(event, origionalTile) {
    const boardElement = boardRef.current
    const xPiece = event.clientX
    const yPiece = event.clientY
    const x = Math.ceil((xPiece - boardElement.offsetLeft) / 90)
    const y = Math.ceil(Math.abs((yPiece - boardElement.offsetTop - 720) / 90))
    const direction = turn === "white" ? 1 : -1
    const pieceType = origionalTile.piece.type
    const position = `[${x},${y}]`
    const index = boardIndex[position]
    const newTile = boardArray[index]

    // remove shown moves when piece is dropped
    setShowMoves([])

    // checks if the move made is in our possible moves
    const validMoves =
      possibleMoves[origionalTile.coordinates].includes(position)

    // if move is valid, the code below will update the state of the board
    if (validMoves) {
      checkEnPassant(origionalTile, x, y)

      updateBoard(origionalTile, x, y, pieceType)

      checkOrigionalCastleTiles(origionalTile, position)

      setMoves(moves => [
        ...moves,
        { origionalTile: origionalTile, newTile: newTile },
      ])

      setTurn(turn => (turn === "white" ? "black" : "white"))
    } else {
      if (activePiece) {
        activePiece.style.position = "relative"
        activePiece.style.removeProperty("top")
        activePiece.style.removeProperty("left")
      }
    }

    if (activePiece) {
      activePiece.style.removeProperty("z-index")
    }
    setActivePiece(null)
  }

  function checkEnPassant(origionalTile, x, y) {
    const pX = origionalTile.position.x
    const pY = origionalTile.position.y
    const pieceType = origionalTile.piece.type

    // setting en passant if we meet criteria
    if (pieceType === "pawn" && Math.abs(pY - y) === 2) {
      setEnPassant(() => {
        if (turn === "white") {
          return { x: x, y: y - 1 }
        } else {
          return { x: x, y: y + 1 }
        }
      })
    }
    // if the criteria isn't met we will reset en passant to unavailable
    else {
      setEnPassant(() => {
        return { x: undefined, y: undefined }
      })
    }
  }

  function updateBoard(origionalTile, x, y, pieceType) {
    const position = `[${x},${y}]`
    const direction = origionalTile.piece.color === "white" ? 1 : -1

    if (
      `[${enPassant.x},${enPassant.y}]` === position &&
      pieceType === "pawn"
    ) {
      setBoardArray(
        boardArray.map(tile => {
          if (tile.coordinates === position) {
            return { ...tile, piece: origionalTile.piece }
          } else if (tile === origionalTile) {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else if (tile.coordinates === `[${x},${y - direction}]`) {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else {
            return tile
          }
        })
      )
    } else if (
      whiteLeftCastle &&
      pieceType === "king" &&
      position === "[3,1]"
    ) {
      setBoardArray(
        boardArray.map(tile => {
          if (tile.coordinates === "[1,1]" || tile.coordinates === "[5,1]") {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else if (tile.coordinates === "[3,1]") {
            return {
              ...tile,
              piece: { image: kingWhite, type: "king", color: "white" },
            }
          } else if (tile.coordinates === "[4,1]") {
            return {
              ...tile,
              piece: { image: rookWhite, type: "rook", color: "white" },
            }
          } else {
            return tile
          }
        })
      )
    } else if (
      whiteRightCastle &&
      pieceType === "king" &&
      position === "[7,1]"
    ) {
      setBoardArray(
        boardArray.map(tile => {
          if (tile.coordinates === "[8,1]" || tile.coordinates === "[5,1]") {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else if (tile.coordinates === "[7,1]") {
            return {
              ...tile,
              piece: { image: kingWhite, type: "king", color: "white" },
            }
          } else if (tile.coordinates === "[6,1]") {
            return {
              ...tile,
              piece: { image: rookWhite, type: "rook", color: "white" },
            }
          } else {
            return tile
          }
        })
      )
    } else if (
      blackLeftCastle &&
      pieceType === "king" &&
      position === "[3,8]"
    ) {
      setBoardArray(
        boardArray.map(tile => {
          if (tile.coordinates === "[1,8]" || tile.coordinates === "[5,8]") {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else if (tile.coordinates === "[3,8]") {
            return {
              ...tile,
              piece: { image: kingBlack, type: "king", color: "black" },
            }
          } else if (tile.coordinates === "[4,8]") {
            return {
              ...tile,
              piece: { image: rookBlack, type: "rook", color: "black" },
            }
          } else {
            return tile
          }
        })
      )
    } else if (
      blackRightCastle &&
      pieceType === "king" &&
      position === "[7,8]"
    ) {
      setBoardArray(
        boardArray.map(tile => {
          if (tile.coordinates === "[8,8]" || tile.coordinates === "[5,8]") {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else if (tile.coordinates === "[7,8]") {
            return {
              ...tile,
              piece: { image: kingBlack, type: "king", color: "black" },
            }
          } else if (tile.coordinates === "[6,8]") {
            return {
              ...tile,
              piece: { image: rookBlack, type: "rook", color: "black" },
            }
          } else {
            return tile
          }
        })
      )
    } else {
      setBoardArray(
        boardArray.map(tile => {
          if (
            tile.position.x === x &&
            tile.position.y === y &&
            origionalTile.piece.type === "pawn" &&
            (y === 1 || y === 8)
          ) {
            const newPiece = y === 8 ? queenWhite : queenBlack
            const color = origionalTile.piece.color
            return {
              ...tile,
              piece: { image: newPiece, type: "queen", color: color },
            }
          } else if (tile.position.x === x && tile.position.y === y) {
            return { ...tile, piece: origionalTile.piece }
          } else if (tile === origionalTile) {
            return {
              ...tile,
              piece: { image: undefined, type: undefined, color: undefined },
            }
          } else {
            return tile
          }
        })
      )
    }
  }

  function checkMove(tile, x, y, currentBoard) {
    const pX = tile.position.x
    const pY = tile.position.y
    const attacker = tile.piece.color
    const defender = attacker === "white" ? "black" : "white"
    const pieceType = tile.piece.type
    const color = tile.piece.color
    const attack = isTileOccupied(x, y, currentBoard) === defender

    if (pieceType === "pawn") {
      const startRow = attacker === "white" ? 2 : 7
      const direction = attacker === "white" ? 1 : -1
      const pawnMoves = []

      let pawnX = pX
      let pawnY = pY

      // en passant logic
      if (enPassant) {
        if (
          (pawnX - enPassant.x === 1 || pawnX - enPassant.x === -1) &&
          pawnY - enPassant.y === -direction
        ) {
          pawnMoves.push(`[${enPassant.x},${enPassant.y}]`)
        }
      }

      // left attack logic
      if (
        pawnX > 1 &&
        isTileOccupied(pawnX - 1, pawnY + direction, currentBoard) === defender
      ) {
        pawnMoves.push(`[${pawnX - 1},${pawnY + direction}]`)
      }

      // right attack logic
      if (
        pawnX < 8 &&
        isTileOccupied(pawnX + 1, pawnY + direction, currentBoard) === defender
      ) {
        pawnMoves.push(`[${pawnX + 1},${pawnY + direction}]`)
      }

      // allows pawn to jump 2 tile from starting row
      if (
        pawnY === startRow &&
        !isTileOccupied(pawnX, pawnY + direction, currentBoard) &&
        !isTileOccupied(pawnX, pawnY + 2 * direction, currentBoard)
      ) {
        pawnMoves.push(`[${pawnX},${pawnY + 2 * direction}]`)
      }

      // allows pawns to move forward 1 tile
      if (!isTileOccupied(pawnX, pawnY + direction, currentBoard)) {
        pawnMoves.push(`[${pawnX},${pawnY + direction}]`)
      }

      return pawnMoves
    }

    if (pieceType === "knight") {
      let knightMoves = []

      const possibilities = [
        { dx: -2, dy: -1 },
        { dx: -2, dy: 1 },
        { dx: -1, dy: -2 },
        { dx: -1, dy: 2 },
        { dx: 1, dy: -2 },
        { dx: 1, dy: 2 },
        { dx: 2, dy: -1 },
        { dx: 2, dy: 1 },
      ]

      for (let i = 0; i < possibilities.length; i++) {
        const { dx, dy } = possibilities[i]
        const knightX = pX + dx
        const knightY = pY + dy

        if (!(knightX < 1 || knightX > 8 || knightY < 1 || knightY > 8)) {
          if (isTileOccupied(knightX, knightY, currentBoard) !== color) {
            knightMoves.push(`[${knightX},${knightY}]`)
          }
        }
      }

      return knightMoves
    }

    if (pieceType === "bishop") {
      let bishopMoves = []

      const directions = [
        { dx: 1, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
      ]

      for (const direction of directions) {
        let bishopX = pX
        let bishopY = pY

        for (let i = 1; i < 9; i++) {
          bishopX += direction.dx
          bishopY += direction.dy

          if (bishopX < 1 || bishopX > 8 || bishopY < 1 || bishopY > 8) break

          bishopMoves.push(`[${bishopX},${bishopY}]`)

          if (isTileOccupied(bishopX, bishopY, currentBoard)) {
            if (isTileOccupied(bishopX, bishopY, currentBoard) === color) {
              bishopMoves.pop()
            }
            break
          }
        }
      }

      return bishopMoves
    }

    if (pieceType === "rook") {
      let rookMoves = []

      const directions = [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
      ]

      for (const direction of directions) {
        let rookX = pX
        let rookY = pY

        for (let i = 1; i < 9; i++) {
          rookX += direction.dx
          rookY += direction.dy

          if (rookX < 1 || rookX > 8 || rookY < 1 || rookY > 8) break

          rookMoves.push(`[${rookX},${rookY}]`)

          if (isTileOccupied(rookX, rookY, currentBoard)) {
            if (isTileOccupied(rookX, rookY, currentBoard) === color) {
              rookMoves.pop()
            }
            break
          }
        }
      }
      return rookMoves
    }

    if (pieceType === "queen") {
      let queenMoves = []

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

      for (const direction of directions) {
        let queenX = pX
        let queenY = pY

        for (let i = 1; i < 9; i++) {
          queenX += direction.dx
          queenY += direction.dy

          if (queenX < 1 || queenX > 8 || queenY < 1 || queenY > 8) break

          queenMoves.push(`[${queenX},${queenY}]`)

          if (isTileOccupied(queenX, queenY, currentBoard)) {
            if (isTileOccupied(queenX, queenY, currentBoard) === color) {
              queenMoves.pop()
            }
            break
          }
        }
      }

      return queenMoves
    }

    if (pieceType === "king") {
      let kingMoves = []

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

      for (const direction of directions) {
        let kingX = pX
        let kingY = pY

        for (let i = 1; i < 2; i++) {
          kingX += direction.dx
          kingY += direction.dy

          if (kingX < 1 || kingX > 8 || kingY < 1 || kingY > 8) break

          kingMoves.push(`[${kingX},${kingY}]`)

          if (isTileOccupied(kingX, kingY, currentBoard)) {
            if (isTileOccupied(kingX, kingY, currentBoard) === color) {
              kingMoves.pop()
            }
            break
          }
        }
      }

      const kingMovesDanger = kingMoves.filter(move => {
        return opponentMovesState.includes(move) === false
      })

      return kingMovesDanger
    }
  }

  // monitoring the origional castleTiles and updating castling criteria
  function checkOrigionalCastleTiles(origionalTile, position) {
    // white king
    if (origionalTile.coordinates === "[5,1]") {
      setWhiteLeftCastle(() => {
        return false
      })

      setWhiteRightCastle(() => {
        return false
      })
    }
    // white left rook
    if (origionalTile.coordinates === "[1,1]" || position === "[1,1]") {
      setWhiteLeftCastle(() => {
        return false
      })
    }
    // white right rook
    if (origionalTile.coordinates === "[8,1]" || position === "[8,1]") {
      setWhiteRightCastle(() => {
        return false
      })
    }

    // black king
    if (origionalTile.coordinates === "[8,5]") {
      setBlackLeftCastle(() => {
        return false
      })

      setBlackRightCastle(() => {
        return false
      })
    }
    // black left rook
    if (origionalTile.coordinates === "[1,8]" || position === "[1,8]]") {
      setBlackLeftCastle(() => {
        return false
      })
    }
    // black right rook
    if (origionalTile.coordinates === "[8,8]" || position === "[8,8]") {
      setBlackRightCastle(() => {
        return false
      })
    }
  }

  let message = "N/A"
  if (checkmate) message = "Checkmate"
  if (draw) message = "Draw"

  return (
    <>
      <div className="window">
        <div className="board-area">
          <div className="top-bar-placeholder">
            <span className="top-box">
              {turn === "white" ? "White" : "Black"}
            </span>
            <span className="top-box">
              {inCheck[0] === true ? "Check" : "N/A"}
            </span>
            <span className="top-box">{message}</span>
          </div>

          {/* <div className="top-bar">
          <div className="left-box">
            <div className="username">Austin_Cavanagh</div>
            <div className="lost-pieces">Lost Pieces</div>
          </div>
          <div className="timer">99:99</div>
        </div> */}

          <div className="numbers-and-board">
            <div className="board-numbers">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
            </div>
            <div className="board" ref={boardRef}>
              {boardArray.map((tile, index) => {
                return (
                  <div
                    className={`tile ${
                      (tile.position.x + tile.position.y) % 2 === 0
                        ? "dark"
                        : "light"
                    }`}
                    key={index}
                  >
                    {(() => {
                      if (
                        tile.piece.image !== undefined &&
                        showMoves.includes(tile)
                      ) {
                        return (
                          <div
                            style={{
                              backgroundImage: `url(${tile.piece.image})`,
                            }}
                            className="chess-piece"
                            onMouseDown={event => grabPiece(event, tile)}
                            onMouseMove={event =>
                              movePiece(event, boardRef, activePiece)
                            }
                            onMouseUp={event => dropPiece(event, tile)}
                          >
                            <div className={"show-dot"}></div>
                          </div>
                        )
                      } else if (tile.piece.image !== undefined) {
                        return (
                          <div
                            style={{
                              backgroundImage: `url(${tile.piece.image})`,
                            }}
                            className="chess-piece"
                            onMouseDown={event => grabPiece(event, tile)}
                            onMouseMove={event =>
                              movePiece(event, boardRef, activePiece)
                            }
                            onMouseUp={event => dropPiece(event, tile)}
                          ></div>
                        )
                      } else if (showMoves.includes(tile)) {
                        return <div className={"show-dot"}></div>
                      }
                    })()}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="board-letters">
            <div>a</div>
            <div>b</div>
            <div>c</div>
            <div>d</div>
            <div>e</div>
            <div>f</div>
            <div>g</div>
            <div>h</div>
          </div>
        </div>

        <div className="moves-and-chat">
          <form className="chat">
            <ul className="chat-list">
              <li>Chat 1</li>
              <li>Chat 2</li>
              <li>Chat 3</li>
              <li>Chat 4</li>
            </ul>
            <input type="text" defaultValue="Send a message..." />
          </form>

          <div className="moves-list">
            {[...moves].reverse().map((move, index) => {
              const currMove = moves.length - index
              const oldTile = move.origionalTile
              const newTile = move.newTile

              return (
                <div className={`move ${oldTile.piece.color}`} key={currMove}>
                  <div className="move-number">{`${currMove}.`}</div>

                  <div className="move-pair">
                    <div
                      style={{
                        backgroundImage: `url(${oldTile.piece.image})`,
                      }}
                      className="move-image"
                    ></div>
                    <div>{oldTile.official}</div>
                  </div>

                  <div className="move-pair">
                    <div
                      style={{
                        backgroundImage: `url(${newTile.piece.image})`,
                      }}
                      className="move-image"
                    ></div>
                    <div>{newTile.official}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
