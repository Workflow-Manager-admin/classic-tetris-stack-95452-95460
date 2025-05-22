import React from 'react';
import './App.css';
import TetrisContainer from './components/TetrisContainer';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> Classic Tetris
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <h1 className="title">Classic Tetris</h1>
            <div className="description">
              A classic Tetris game with traditional block-stacking gameplay. Use arrow keys to move and rotate pieces!
            </div>
          </div>
          
          {/* Main Tetris Container */}
          <TetrisContainer />
        </div>
      </main>
    </div>
  );
}

export default App;