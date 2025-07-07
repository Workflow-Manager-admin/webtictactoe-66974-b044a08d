import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette from requirements
const PRIMARY = "#1976D2";
const SECONDARY = "#757575";
const ACCENT = "#FBC02D";

// --- COMPONENTS ---

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /**
   * A single Tic Tac Toe board cell.
   * @param {string|null} value X, O, or null.
   * @param {function} onClick Handle for when the square is clicked.
   * @param {boolean} highlight If set, use accent color background.
   */
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /**
   * Renders the 3x3 Tic Tac Toe board.
   * @param {string[]} squares - 9 length array representing board cells.
   * @param {function} onSquareClick - Invoked with index.
   * @param {number[]|null} winningLine - Array of indexes of winning line, or null.
   */
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={highlight}
      />
    );
  }
  // Render rows
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function GameStatus({ winner, draw, currentPlayer }) {
  /**
   * Displays game status: winner, draw, or next player.
   */
  let status;
  if (winner) {
    status = (
      <span>
        Winner:{" "}
        <span className="ttt-status-winner">{winner}</span>
      </span>
    );
  } else if (draw) {
    status = <span className="ttt-status-draw">It's a Draw!</span>;
  } else {
    status = (
      <span>
        Next: <span className={`ttt-status-next ttt-status-${currentPlayer}`}>
          {currentPlayer}
        </span>
      </span>
    );
  }
  return <div className="ttt-status">{status}</div>;
}

// PUBLIC_INTERFACE
function Scoreboard({ history }) {
  /**
   * Shows how many wins for each player and draws.
   * @param {object} history - {X:number, O:number, draw:number}
   */
  return (
    <div className="ttt-scoreboard">
      <div style={{ color: PRIMARY }}>
        X <span className="ttt-score">{history.X}</span>
      </div>
      <div style={{ color: SECONDARY }}>
        Draw <span className="ttt-score">{history.draw}</span>
      </div>
      <div style={{ color: ACCENT }}>
        O <span className="ttt-score">{history.O}</span>
      </div>
    </div>
  );
}

// Detect win: Returns {winner, line}, or {draw:true}, or {}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6], // Diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  if (squares.every((v) => v)) {
    return { draw: true };
  }
  return {};
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Tic Tac Toe Game app.
   * Manages board state, players, turns, win/draw, and theme.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState({ X: 0, O: 0, draw: 0 });
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [draw, setDraw] = useState(false);
  const [theme] = useState("light"); // Fixed as 'light' per requirements

  useEffect(() => {
    // Always apply light theme
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    const res = calculateWinner(squares);
    if (res.winner && !winner) {
      setWinner(res.winner);
      setWinningLine(res.line);
      setHistory((h) => ({
        ...h,
        [res.winner]: h[res.winner] + 1,
      }));
    } else if (res.draw && !winner && !draw) {
      setDraw(true);
      setHistory((h) => ({
        ...h,
        draw: h.draw + 1,
      }));
    }
  // Only trigger when squares change (not after reset of winner/draw)
  // eslint-disable-next-line
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (squares[i] || winner || draw) return; // Ignore if filled or finished
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext((prev) => !prev); // Alternate who starts
    setWinner(null);
    setWinningLine(null);
    setDraw(false);
  }

  return (
    <div className="App">
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <Scoreboard history={history} />
        <GameStatus
          winner={winner}
          draw={draw}
          currentPlayer={xIsNext ? "X" : "O"}
        />
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <button className="ttt-reset-btn" onClick={resetGame} aria-label="Reset game">
          Reset
        </button>
      </main>
    </div>
  );
}

export default App;
