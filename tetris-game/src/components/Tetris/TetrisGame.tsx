"use client";

import React, { useState, useEffect } from 'react';
import Board from './Board';
import { PIECES, PieceShape } from './Piece';

const createEmptyBoard = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

const TetrisGame = () => {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard(20, 10));

  useEffect(() => {
    console.log("Initial board:", board);
    setBoard(createEmptyBoard(20, 10));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <h1 className="text-white text-2xl mb-4">Tetris Game Loaded</h1>
      <Board board={board} />
    </div>
  );
};

export default TetrisGame;
