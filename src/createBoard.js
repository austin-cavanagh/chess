import pawnWhite from './pieces/pawn_white.png';
import pawnBlack from './pieces/pawn_black.png';
import knightWhite from './pieces/knight_white.png';
import knightBlack from './pieces/knight_black.png';
import bishopWhite from './pieces/bishop_white.png';
import bishopBlack from './pieces/bishop_black.png';
import rookWhite from './pieces/rook_white.png';
import rookBlack from './pieces/rook_black.png';
import queenWhite from './pieces/queen_white.png';
import queenBlack from './pieces/queen_black.png';
import kingWhite from './pieces/king_white.png';
import kingBlack from './pieces/king_black.png';

import { boardIndex } from './boardIndex';

export const initialBoard = createBoard();
export const initialKingPosition = initialBoard[60];
export const initialOpenTilesAroundKing = openTilesAroundKing(
  initialBoard,
  initialKingPosition,
  'white'
);

// creates starting board
export function createBoard() {
  const board = [];
  const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  for (let i = verticalAxis.length - 1; i >= 0; i--) {
    for (let j = 0; j < horizontalAxis.length; j++) {
      switch (true) {
        case i === 6:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: pawnBlack, type: 'pawn', color: 'black' },
          });
          break;
        case i === 1:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: pawnWhite, type: 'pawn', color: 'white' },
          });
          break;
        case (i === 7 && j === 0) || (i === 7 && j === 7):
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: rookBlack, type: 'rook', color: 'black' },
          });
          break;
        case (i === 0 && j === 0) || (i === 0 && j === 7):
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: rookWhite, type: 'rook', color: 'white' },
          });
          break;
        case (i === 7 && j === 1) || (i === 7 && j === 6):
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: knightBlack, type: 'knight', color: 'black' },
          });
          break;
        case (i === 0 && j === 1) || (i === 0 && j === 6):
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: knightWhite, type: 'knight', color: 'white' },
          });
          break;
        case (i === 7 && j === 2) || (i === 7 && j === 5):
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: bishopBlack, type: 'bishop', color: 'black' },
          });
          break;
        case (i === 0 && j === 2) || (i === 0 && j === 5):
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: bishopWhite, type: 'bishop', color: 'white' },
          });
          break;
        case i === 7 && j === 3:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: queenBlack, type: 'queen', color: 'black' },
          });
          break;
        case i === 0 && j === 3:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: queenWhite, type: 'queen', color: 'white' },
          });
          break;
        case i === 7 && j === 4:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: kingBlack, type: 'king', color: 'black' },
          });
          break;
        case i === 0 && j === 4:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: kingWhite, type: 'king', color: 'white' },
          });
          break;
        default:
          board.push({
            position: { x: j + 1, y: i + 1 },
            coordinates: `[${j + 1},${i + 1}]`,
            official: `${horizontalAxis[j]}${verticalAxis[i]}`,
            piece: { image: undefined, type: undefined, color: undefined },
          });
          break;
      }
    }
  }
  return board;
}

export function openTilesAroundKing(board, kingPosition, turn) {
  let kingMoves = [];
  const x = kingPosition.position.x;
  const y = kingPosition.position.y;

  const directions = [
    { dx: 1, dy: 1 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
  ];

  directions.forEach(direction => {
    let kingX = x;
    let kingY = y;

    kingX += direction.dx;
    kingY += direction.dy;
    const currentTile = `[${kingX},${kingY}]`;

    const index = boardIndex[currentTile];
    const tileValue = board[index];

    if (
      !(kingX < 1 || kingX > 8 || kingY < 1 || kingY > 8) &&
      tileValue.piece.color === turn
    ) {
      kingMoves.push(`[${kingX},${kingY}]`);
    }
  });

  return kingMoves;
}
