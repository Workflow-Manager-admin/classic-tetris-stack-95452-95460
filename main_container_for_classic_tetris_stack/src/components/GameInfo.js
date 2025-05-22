import React from 'react';
import './GameInfo.css';
import { CELL_SIZE } from '../constants/gameConstants';

// PUBLIC_INTERFACE
/**
 * GameInfo component for Classic Tetris
 * Displays game information like score, level, next piece and game controls
 * @param {Object} props - Component props
 * @param {number} props.score - Current game score
 * @param {number} props.level - Current game level
 * @param {number} props.rows - Number of rows cleared
 * @param {Object} props.nextTetromino - The next tetromino that will appear
 * @param {Function} props.startGame - Function to start a new game
 * @param {boolean} props.gameOver - Whether the game is over
 * @param {boolean} props.paused - Whether the game is paused
 * @param {Function} props.togglePause - Function to toggle pause state
 * @returns {JSX.Element} The game information panel
 */
const GameInfo = ({ score, level, rows, nextTetromino, startGame, gameOver, paused, togglePause }) => {
  // Render the next tetromino preview
  const renderNextTetromino = () => {
    if (!nextTetromino) return null;
    
    const shape = nextTetromino.shape;
    const color = nextTetromino.color;
    
    const previewGrid = Array(4).fill().map(() => Array(4).fill(0));
    
    // Copy the shape into the preview grid, centered
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const previewX = x;
          const previewY = y;
          if (
            previewY >= 0 && 
            previewY < 4 && 
            previewX >= 0 && 
            previewX < 4
          ) {
            previewGrid[previewY][previewX] = cell;
          }
        }
      });
    });
    
    return (
      <div className="next-tetromino">
        {previewGrid.map((row, y) => (
          <div className="preview-row" key={`preview-row-${y}`}>
            {row.map((cell, x) => (
              <div
                key={`preview-cell-${x}-${y}`}
                className="preview-cell"
                style={{
                  backgroundColor: cell !== 0 ? color : 'transparent',
                  width: CELL_SIZE * 0.8,
                  height: CELL_SIZE * 0.8,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-info">
      <div className="info-section next-piece-section">
        <h3>Next Piece</h3>
        <div className="next-piece-display">
          {renderNextTetromino()}
        </div>
      </div>
      
      <div className="info-section score-section">
        <div className="info-item">
          <span className="info-label">Score:</span>
          <span className="info-value">{score}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Level:</span>
          <span className="info-value">{level}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Lines:</span>
          <span className="info-value">{rows}</span>
        </div>
      </div>
      
      <div className="info-section buttons-section">
        {!gameOver ? (
          <button 
            className="game-button"
            onClick={togglePause}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        ) : null}
        
        <button 
          className="game-button"
          onClick={startGame}
        >
          {gameOver ? 'Start Game' : 'Restart'}
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
