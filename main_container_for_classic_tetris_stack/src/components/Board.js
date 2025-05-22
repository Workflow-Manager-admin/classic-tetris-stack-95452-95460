import React from 'react';
import './Board.css';

// PUBLIC_INTERFACE
/**
 * Board component for Classic Tetris
 * Renders the game board with all placed tetrominos and the active piece
 * @param {Object} props - Component props
 * @param {Array} props.board - 2D array representing the game board
 * @param {Object} props.player - Player state including current tetromino and position
 * @returns {JSX.Element} The game board
 */
const Board = ({ board, player }) => {
  // Merge the current tetromino with the board for rendering
  const renderBoard = () => {
    // Clone the board to avoid direct mutation
    const clonedBoard = board.map(row => [...row]);
    
    // Add the player's current tetromino to the board
    if (player.tetromino) {
      player.tetromino.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = player.pos.y + y;
            const boardX = player.pos.x + x;
            
            // Check if the position is within the board boundaries
            if (
              boardY >= 0 && 
              boardY < board.length && 
              boardX >= 0 && 
              boardX < board[0].length
            ) {
              // Only render the tetromino if it's not collided
              if (clonedBoard[boardY][boardX][0] === 0 || clonedBoard[boardY][boardX][1] === 'merged') {
                clonedBoard[boardY][boardX] = [
                  cell, 
                  player.collided ? 'merged' : 'clear', 
                  player.tetrominoColor
                ];
              }
            }
          }
        });
      });
    }
    
    return clonedBoard;
  };

  return (
    <div className="tetris-board">
      {renderBoard().map((row, y) => (
        <div className="board-row" key={`row-${y}`}>
          {row.map((cell, x) => (
            <div
              key={`cell-${x}-${y}`}
              className={`board-cell ${cell[1]}`}
              style={{
                backgroundColor: cell[0] === 0 ? 'transparent' : cell[2] || '#000'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
