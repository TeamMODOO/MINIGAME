'use client';

import { useState, useEffect } from 'react';
import Board from '../components/Board';
import Score from '../components/Score';
import { Tetris } from '../utils/tetrisLogic';

export default function Home() {
  const [game] = useState<Tetris>(new Tetris());
  const [board, setBoard] = useState<string[][]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    game.init();
    setBoard(game.getBoard());

    const interval = setInterval(() => {
      game.moveBlock('n', 1); // 블록 아래로 이동
      setBoard(game.getBoard()); // 보드 상태 업데이트
      setScore(game.score); // 점수 업데이트
    }, game.duration);

    return () => clearInterval(interval); // 클린업
  }, [game]);

  return (
    <div>
      <Score score={score} level={game.level} />
      <Board board={board} />
    </div>
  );
}
