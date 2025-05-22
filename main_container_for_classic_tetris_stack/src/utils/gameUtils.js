/**
 * Game utility functions for Classic Tetris
 */

// Creates a blank board
export const createBoard = (width, height) => {
  return Array.from(Array(height), () => 
    Array.from(Array(width), () => [0, 'clear'])
  );
};

// Check if tetromino collides with walls or filled cells
export const checkCollision = (player, board, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we're on an actual tetromino cell
      if (player.tetromino[y][x] !== 0) {
        // 2. Check movement is inside game area height (y)
        // We shouldn't go through the bottom of the board
        if (
          !board[y + player.pos.y + moveY] ||
          // 3. Check movement is inside game area width (x)
          !board[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check the cell we're moving to isn't set to 'clear'
          board[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// Rotate a tetromino - standard matrix rotation algorithm
export const rotate = (matrix, dir) => {
  // Make the rows become columns
  const rotatedTetromino = matrix.map((_, index) => 
    matrix.map(col => col[index])
  );
  
  // Reverse each row to get a rotated matrix
  if (dir > 0) return rotatedTetromino.map(row => row.reverse());
  return rotatedTetromino.reverse();
};

// Clear completed rows and calculate points
export const clearRows = (board, setRowsCleared) => {
  const sweepedRows = board.reduce((acc, row) => {
    // If we don't find a 0 in the row (meaning the row is full)
    if (row.findIndex(cell => cell[0] === 0) === -1) {
      // Add an empty row at the beginning of the array to push the rows down
      acc.unshift(new Array(row.length).fill([0, 'clear']));
      return acc;
    }
    acc.push(row);
    return acc;
  }, []);

  const rowsCleared = board.length - sweepedRows.length;
  if (rowsCleared > 0) {
    setRowsCleared(rowsCleared);
  }
  
  return sweepedRows;
};

// Update player position
export const updatePlayerPos = ({ x, y, collided }, player, setPlayer) => {
  setPlayer(prev => ({
    ...prev,
    pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
    collided
  }));
};

// Reset player position and get new tetromino
export const resetPlayer = (setPlayer, randomTetromino) => {
  setPlayer({
    pos: { x: 3, y: 0 },
    tetromino: randomTetromino().shape,
    collided: false,
    tetrominoColor: randomTetromino().color
  });
};
