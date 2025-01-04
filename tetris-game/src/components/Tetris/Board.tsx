import React from 'react';

interface CellProps {
  value: number;
}

const Cell = ({ value }: CellProps) => (
    <div
      className={`w-6 h-6 border`}
      style={{
        backgroundColor: value ? 'blue' : 'gray', // 기본 배경색
      }}
    />
  );  

interface BoardProps {
  board: number[][];
}

const Board = ({ board }: BoardProps) => {
    console.log("Board received:", board);
    return (
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}>
        {board.flat().map((cell, idx) => (
          <Cell key={idx} value={cell} />
        ))}
      </div>
    );
  };
export default Board;
