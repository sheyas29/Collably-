import { useEffect, useMemo, useReducer } from 'react';
import './App.css';
import Board from './Board.jsx';
import { BoardContext } from './context/boardContext';
import { boardReducer, initialState } from './reducer/boardReducer';

const STORAGE_KEY = 'collably-board-state';

function getInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Corrupted data — fall back to seed data
      console.error('Failed to parse saved board state, using defaults');
      return initialState;
    }
  }
  return initialState;
}

function App() {
  const [state, dispatch] = useReducer(
    boardReducer,
    undefined,
    getInitialState
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <>
      <BoardContext.Provider value={value}>
        <Board />
      </BoardContext.Provider>
    </>
  );
}

export default App;
