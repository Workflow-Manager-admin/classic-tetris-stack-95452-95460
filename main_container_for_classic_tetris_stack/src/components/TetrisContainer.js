import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import { createBoard, checkCollision, rotate, clearRows, updatePlayerPos, resetPlayer } from '../utils/gameUtils';
import { BOARD_WIDTH, BOARD_HEIGHT, GAME_SPEEDS, POINTS, LINES_PER_LEVEL, KEY_CODES, randomTetromino } from '../constants/gameConstants';
import './TetrisContainer.css';

// PUBLIC_INTERFACE
/**
 * Main Container for Classic Tetris Stack
 * Manages the game state and controls for a classic Tetris game
 * @returns {JSX.Element} The Tetris game container
 */
const TetrisContainer = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: [[0]],
    collided: false,
    tetrominoColor: '#000'
  });
  const [board, setBoard] = useState(createBoard(BOARD_WIDTH, BOARD_HEIGHT));
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);
  const [nextTetromino, setNextTetromino] = useState(randomTetromino());

  // Update score when rows are cleared
  const updateScore = useCallback((rowsCleared) => {
    if (rowsCleared > 0) {
      // Calculate score based on the number of rows cleared
      const linePoints = [POINTS.SINGLE, POINTS.DOUBLE, POINTS.TRIPLE, POINTS.TETRIS];
      setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
      setRows(prev => prev + rowsCleared);
    }
  }, [level]);

  // Check if player has leveled up
  useEffect(() => {
    if (rows >= (level + 1) * LINES_PER_LEVEL) {
      setLevel(prev => prev + 1);
      // Increase speed
      setDropTime(GAME_SPEEDS[level + 1] || GAME_SPEEDS[GAME_SPEEDS.length - 1]);
    }
  }, [rows, level]);

  // Reset game
  const startGame = useCallback(() => {
    // Reset everything
    setBoard(createBoard(BOARD_WIDTH, BOARD_HEIGHT));
    setDropTime(GAME_SPEEDS[0]);
    resetPlayer(setPlayer, randomTetromino);
    setNextTetromino(randomTetromino());
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (!gameOver) {
      if (paused) {
        setDropTime(GAME_SPEEDS[level]);
      } else {
        setDropTime(null);
      }
      setPaused(!paused);
    }
  }, [gameOver, paused, level]);

  // Move tetromino left/right/down
  const movePlayer = useCallback((dir) => {
    if (!gameOver && !paused) {
      if (!checkCollision(player, board, { x: dir, y: 0 })) {
        updatePlayerPos({ x: dir, y: 0, collided: false }, player, setPlayer);
      }
    }
  }, [gameOver, paused, player, board]);

  // Drop tetromino to the bottom (hard drop)
  const hardDrop = useCallback(() => {
    if (!gameOver && !paused) {
      let dropHeight = 0;
      while (!checkCollision(player, board, { x: 0, y: dropHeight + 1 })) {
        dropHeight++;
      }
      updatePlayerPos({ x: 0, y: dropHeight, collided: true }, player, setPlayer);
      setScore(prev => prev + dropHeight * POINTS.HARD_DROP);
    }
  }, [gameOver, paused, player, board]);

  // Rotate tetromino
  const rotateTetromino = useCallback((dir) => {
    if (!gameOver && !paused) {
      const clonedPlayer = JSON.parse(JSON.stringify(player));
      clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);
      
      // Check that the rotation doesn't cause a collision
      if (!checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
        setPlayer(clonedPlayer);
      }
    }
  }, [gameOver, paused, player, board]);

  // Called on every interval tick (piece drops one step)
  const drop = useCallback(() => {
    if (!gameOver && !paused) {
      // Increase level when rows cleared
      if (rows > (level + 1) * LINES_PER_LEVEL) {
        setLevel(prev => prev + 1);
        setDropTime(GAME_SPEEDS[level + 1] || GAME_SPEEDS[GAME_SPEEDS.length - 1]);
      }

      if (!checkCollision(player, board, { x: 0, y: 1 })) {
        updatePlayerPos({ x: 0, y: 1, collided: false }, player, setPlayer);
      } else {
        // Game over when collides at the top
        if (player.pos.y < 1) {
          setGameOver(true);
          setDropTime(null);
          return;
        }
        
        updatePlayerPos({ x: 0, y: 0, collided: true }, player, setPlayer);
      }
    }
  }, [gameOver, paused, level, rows, player, board]);

  // Handle automatic drop based on timer
  useEffect(() => {
    if (!gameOver && !paused) {
      let timer;
      if (dropTime) {
        timer = setInterval(() => {
          drop();
        }, dropTime);
      }
      return () => {
        clearInterval(timer);
      };
    }
  }, [dropTime, gameOver, paused, drop]);

  // Update board when player collides
  useEffect(() => {
    if (!gameOver && player.collided) {
      // Create a new board with the landed tetromino
      const newBoard = board.map(row =>
        row.map(cell => {
          return cell[1] === 'clear' ? cell : [1, 'merged'];
        })
      );
      
      // Add the current tetromino to the board
      for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
          if (player.tetromino[y][x] !== 0) {
            newBoard[y + player.pos.y][x + player.pos.x] = [
              1,
              'merged',
              player.tetrominoColor
            ];
          }
        }
      }
      
      // Clear rows and calculate score
      const clearedBoard = clearRows(newBoard, (rowsCleared) => {
        updateScore(rowsCleared);
      });
      
      setBoard(clearedBoard);
      
      // Get next tetromino
      const nextPiece = nextTetromino;
      setNextTetromino(randomTetromino());
      
      // Reset player with the next tetromino
      setPlayer({
        pos: { x: 3, y: 0 },
        tetromino: nextPiece.shape,
        collided: false,
        tetrominoColor: nextPiece.color
      });
    }
  }, [gameOver, player, updateScore, nextTetromino, board]);

  // Handle keyboard controls
  const handleKeyDown = useCallback(({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === KEY_CODES.P) {
        togglePause();
      }
      
      if (!paused) {
        switch(keyCode) {
          case KEY_CODES.LEFT:
            movePlayer(-1);
            break;
          case KEY_CODES.RIGHT:
            movePlayer(1);
            break;
          case KEY_CODES.DOWN:
            drop();
            setScore(prev => prev + POINTS.SOFT_DROP);
            break;
          case KEY_CODES.UP:
            rotateTetromino(1);
            break;
          case KEY_CODES.SPACE:
            hardDrop();
            break;
          default:
            break;
        }
      }
    }
  }, [gameOver, paused, movePlayer, drop, rotateTetromino, hardDrop, togglePause]);

  // Add/remove keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="tetris-container">
      <div className="game-area">
        {/* Game status overlay */}
        {(gameOver || paused) && (
          <div className="game-overlay">
            <div className="overlay-content">
              {gameOver ? (
                <>
                  <h2>Game Over</h2>
                  <button onClick={startGame}>Start New Game</button>
                </>
              ) : (
                <>
                  <h2>Paused</h2>
                  <button onClick={togglePause}>Resume</button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Game board */}
        <Board board={board} player={player} />
        
        {/* Game information panel */}
        <GameInfo 
          score={score}
          level={level}
          rows={rows}
          nextTetromino={nextTetromino}
          startGame={startGame}
          gameOver={gameOver}
          paused={paused}
          togglePause={togglePause}
        />
      </div>
      
      <div className="controls-info">
        <h3>Controls:</h3>
        <p>← → : Move left/right</p>
        <p>↑ : Rotate</p>
        <p>↓ : Soft drop</p>
        <p>Space : Hard drop</p>
        <p>P : Pause</p>
      </div>
    </div>
  );
};

export default TetrisContainer;
