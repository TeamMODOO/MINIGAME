"use client";

import React, { useState, useEffect } from 'react';
import Board from './Board';

const createEmptyBoard = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, (_, rowIdx) =>
    Array.from({ length: cols }, (_, colIdx) => (rowIdx === 0 ? 1 : 0)) // 첫 번째 행에 블록 추가
  );


const TetrisGame = () => {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard(20, 10));

  useEffect(() => {
    console.log("Board state:", board); // 보드 데이터 디버깅
  }, [board]);
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <h1 className="text-white text-2xl mb-4">Tetris Game Loaded</h1>
      <Board board={board} />
    </div>
  );
};

export default TetrisGame;
