/**
 * Game constants for Classic Tetris
 * Defines board dimensions, tetromino shapes, colors, and game mechanics
 */

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

// Tetrominos - using standard representation where 0 is empty space and 1 is filled
export const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00FFFF', // Cyan
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000FF', // Blue
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#FFA500', // Orange
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#FFFF00', // Yellow
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00FF00', // Green
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#800080', // Purple
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#FF0000', // Red
  }
};

// Randomly select a tetromino
export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

// Game speeds in milliseconds (by level)
export const GAME_SPEEDS = [
  800, 720, 630, 550, 470, 380, 300, 220, 130, 100, 80, 80, 80, 70, 70, 70, 50, 50, 50, 30
];

// Scoring system
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

// Level up after clearing 10 lines
export const LINES_PER_LEVEL = 10;

// Key codes for game controls
export const KEY_CODES = {
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  UP: 38, // Rotate
  SPACE: 32, // Hard drop
  P: 80    // Pause
};
