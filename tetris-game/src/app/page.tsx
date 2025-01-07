'use client';

import { useState, useEffect } from 'react';
import Board from '../components/Board';
import Score from '../components/Score';
import { Tetris } from '../utils/tetrisLogic';

export default function Home() {
  const [game] = useState<Tetris>(new Tetris());
  const [board, setBoard] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    game.init();
    setBoard(game.getBoard());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (game.gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          game.moveBlock('m', -1); // 왼쪽 이동
          break;
        case 'ArrowRight':
          game.moveBlock('m', 1); // 오른쪽 이동
          break;
        case 'ArrowDown':
          game.moveBlock('n', 1); // 아래로 빠르게 이동
          break;
      }
      setBoard(game.getBoard()); // 이동 후 보드 상태 업데이트
    };

    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      if (game.gameOver) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      game.moveBlock('n', 1); // 블록 아래로 이동
      setBoard(game.getBoard());
      setScore(game.score);
    }, game.duration);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [game]);

  const restartGame = () => {
    const newGame = new Tetris();
    newGame.init();
    setGameOver(false);
    setBoard(newGame.getBoard());
    setScore(0);
  };

  return (
    <div>
      {gameOver && (
        <div>
          <p>Game Over</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      <Score score={score} level={game.level} />
      <Board board={board} />
    </div>
  );
}
