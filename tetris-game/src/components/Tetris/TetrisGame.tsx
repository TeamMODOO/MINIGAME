"use client";

import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import { PIECES, PieceShape } from "./Piece";

const createEmptyBoard = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

const rotatePieceClockwise = (piece: PieceShape): PieceShape => {
  const rows = piece.length;
  const cols = piece[0].length;
  const newPiece = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      newPiece[x][rows - 1 - y] = piece[y][x]; // 행렬의 전치 및 열 순서 반전
    }
  }

  return newPiece;
};

const TetrisGame = () => {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard(20, 10));
  const [currentPiece, setCurrentPiece] = useState<PieceShape>(PIECES["T"]);
  const positionRef = useRef({ x: 4, y: 0 }); // 최신 position 상태 관리
  const currentPieceRef = useRef(currentPiece); // currentPiece 최신 상태 참조

  useEffect(() => {
    currentPieceRef.current = currentPiece;
  }, [currentPiece]); // currentPiece가 변경될 때 ref 업데이트

  const isValidMove = (piece: PieceShape, x: number, y: number) => {
    for (let dy = 0; dy < piece.length; dy++) {
      for (let dx = 0; dx < piece[dy].length; dx++) {
        if (piece[dy][dx]) {
          const newY = y + dy;
          const newX = x + dx;

          if (
            newY < 0 || // 상단 경계
            newY >= board.length || // 하단 경계
            newX < 0 || // 좌측 경계
            newX >= board[0].length || // 우측 경계
            board[newY][newX] // 다른 블록과 충돌
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

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
    const { x, y } = positionRef.current;
    const newX = x + dx;
    const newY = y + dy;

    if (isValidMove(currentPieceRef.current, newX, newY)) {
      positionRef.current = { x: newX, y: newY }; // 최신 position 업데이트
      const updatedBoard = mergePieceToBoard(currentPieceRef.current, newX, newY);
      setBoard(updatedBoard); // 새로운 보드 상태 반영
    }
  };

  const rotatePiece = () => {
    const rotatedPiece = rotatePieceClockwise(currentPieceRef.current);
    const { x, y } = positionRef.current;

    if (isValidMove(rotatedPiece, x, y)) {
      currentPieceRef.current = rotatedPiece; // ref로 현재 조각 업데이트
      setCurrentPiece(rotatedPiece); // 상태 업데이트
      const updatedBoard = mergePieceToBoard(rotatedPiece, x, y);
      setBoard(updatedBoard); // 보드 상태 업데이트
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") movePiece(-1, 0);
    if (e.key === "ArrowRight") movePiece(1, 0);
    if (e.key === "ArrowDown") movePiece(0, 1);
    if (e.key === "ArrowUp") rotatePiece(); // 회전
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const initialBoard = mergePieceToBoard(currentPieceRef.current, positionRef.current.x, positionRef.current.y);
    setBoard(initialBoard);
  }, []); // 빈 배열로 설정해 컴포넌트 초기화 시 실행

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <h1 className="text-white text-2xl mb-4">Tetris Game</h1>
      <Board board={board} />
    </div>
  );
};

export default TetrisGame;
