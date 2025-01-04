"use client";

import React, { useState, useEffect } from 'react';
import Board from './Board';
import { PIECES, PieceShape } from './Piece';

const createEmptyBoard = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

const TetrisGame = () => {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard(20, 10));
  const [currentPiece, setCurrentPiece] = useState<PieceShape>(PIECES['T']);
  const [position, setPosition] = useState({ x: 4, y: 0 }); // 초기 위치

  const mergePieceToBoard = (piece: PieceShape, x: number, y: number) => {
    const newBoard = createEmptyBoard(20, 10); // 항상 빈 보드 생성
    piece.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell && y + dy < newBoard.length && x + dx >= 0 && x + dx < newBoard[0].length) {
          newBoard[y + dy][x + dx] = cell;
        }
      });
    });
    return newBoard;
  };
  

  const movePiece = (dx: number, dy: number) => {
    const { x, y } = position;
    setPosition({ x: x + dx, y: y + dy });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') movePiece(-1, 0);
    if (e.key === 'ArrowRight') movePiece(1, 0);
    if (e.key === 'ArrowDown') movePiece(0, 1);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  useEffect(() => {
    const newBoard = createEmptyBoard(20, 10);
    const mergedBoard = mergePieceToBoard(currentPiece, position.x, position.y);
    setBoard(mergedBoard);
  }, [position]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <h1 className="text-white text-2xl mb-4">Tetris Game Loaded</h1>
      <Board board={board} />
    </div>
  );
};

export default TetrisGame;
