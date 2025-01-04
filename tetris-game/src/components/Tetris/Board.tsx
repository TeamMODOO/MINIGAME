import React from 'react';

interface CellProps {
  value: number;
}

const Cell = ({ value }: CellProps) => (
  <div
    style={{
      width: '24px', // 고정 크기
      height: '24px',
      backgroundColor: value ? 'blue' : 'gray', // 값에 따른 배경색
      border: '1px solid black', // 경계선
    }}
  />
);

interface BoardProps {
  board: number[][];
}
const Board = ({ board }: BoardProps) => {
  // console.log('Rendering board:', board); // 디버깅 출력
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board[0].length}, 24px)`, // 고정 크기
        gap: '0px',
      }}
    >
      {board.flat().map((cell, idx) => (
        <Cell key={idx} value={cell} />
      ))}
    </div>
  );
};

export default Board;
