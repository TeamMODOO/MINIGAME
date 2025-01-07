// tetrisLogic.ts

import blocks from './blocks';

export class Tetris {
  N: number;
  M: number;
  score: number;
  level: number;
  duration: number;
  blockInfo?: { type: string; direction: number; n: number; m: number };
  movingBlock?: { type: string; direction: number; n: number; m: number };
  nextBlocks: string[];
  board: string[][];

  constructor() {
    this.N = 20; // 보드 세로 길이
    this.M = 10; // 보드 가로 길이
    this.score = 0;
    this.level = 1;
    this.duration = 1000;
    this.nextBlocks = [];
    this.board = this.createEmptyBoard();
  }

// 보드 데이터를 반환
 getBoard(): string[][] {
    return this.board.map(row => [...row]); // 보드의 복사본 반환   
    }

moveBlock(where: 'n' | 'm', amount: number): void {
    if (!this.movingBlock) return;
  
    const nextPosition = { ...this.movingBlock };
    nextPosition[where] += amount;
  
    // 충돌 감지
    if (this.isColliding(nextPosition.n, nextPosition.m, nextPosition.direction)) {
      if (where === 'n') {
        this.finishBlock(); // 세로 방향에서 충돌하면 블록 고정
      }
      return;
    }
  
    // 이동 허용
    this.movingBlock[where] += amount;
    this.renderBlock();
  }
      

  // 빈 보드 생성
  createEmptyBoard(): string[][] {
    return Array.from({ length: this.N }, () => Array(this.M).fill(''));
  }

  // 게임 초기화
  init(): void {
    this.score = 0;
    this.level = 1;
    this.duration = 1000;
    this.board = this.createEmptyBoard();
    this.nextBlocks = [];
    for (let i = 0; i < 4; i++) {
      this.makeNextBlock();
    }
    this.makeNewBlock();
  }

  // 다음 블록 생성
  makeNextBlock(): void {
    const blockArray = Object.keys(blocks);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    this.nextBlocks.push(blockArray[randomIndex]);
  }

  // 새 블록 생성
  makeNewBlock(): void {
    if (!this.nextBlocks.length) {
      this.makeNextBlock();
    }

    const next = this.nextBlocks.shift();
    if (!next) {
      throw new Error('Failed to create new block.');
    }

    this.blockInfo = { type: next, direction: 0, n: 0, m: Math.floor(this.M / 2) - 2 };
    this.movingBlock = { ...this.blockInfo };

    this.renderBlock();
  }

  // 블록 렌더링
  renderBlock(): void {
    if (!this.movingBlock) return;
  
    const { type, direction, n, m } = this.movingBlock;
  
    // 기존 active 블록 제거
    this.clearMovingBlock();
  
    const isColliding = blocks[type][direction].some(([x, y]) => {
      const newX = n + x;
      const newY = m + y;
      return (
        newX < 0 ||
        newX >= this.N ||
        newY < 0 ||
        newY >= this.M ||
        this.board[newX][newY] === 'fixed'
      );
    });
  
    if (isColliding) {
      if (this.blockInfo) {
        this.movingBlock = { ...this.blockInfo }; // 충돌 시 원래 위치로 복원
      }
      return;
    }
  
    // 이동 중인 블록 렌더링
    blocks[type][direction].forEach(([x, y]) => {
      const newX = n + x;
      const newY = m + y;
      if (this.board[newX]) {
        this.board[newX][newY] = 'active';
      }
    });
  }
  
  

  // 기존 블록 제거
  clearMovingBlock(): void {
    this.board = this.board.map(row =>
      row.map(cell => (cell === 'active' ? '' : cell)) // active만 제거
    );
  }
  

  finishBlock(): void {
    if (!this.movingBlock) return;
  
    const { type, direction, n, m } = this.movingBlock;
  
    // 현재 블록을 고정 상태로 설정
    blocks[type][direction].forEach(([x, y]) => {
      const newX = n + x;
      const newY = m + y;
      if (this.board[newX]) {
        this.board[newX][newY] = 'fixed'; // 고정 상태로 설정
      }
    });
  
    this.checkFullLines(); // 가득 찬 줄 제거
    this.makeNewBlock(); // 새로운 블록 생성
  }
  
  
  
  isColliding(n: number, m: number, direction: number): boolean {
    return blocks[this.movingBlock?.type || ''][direction].some(([x, y]) => {
      const newX = n + x;
      const newY = m + y;
      return (
        newX < 0 ||
        newX >= this.N ||
        newY < 0 ||
        newY >= this.M ||
        this.board[newX][newY] === 'fixed'
      );
    });
  }
  
// 완전히 채워진 줄을 감지하고 제거
  checkFullLines(): void {
    const newBoard = this.board.filter(row => row.some(cell => cell !== 'fixed') === false);
  
    const clearedLines = this.N - newBoard.length; // 삭제된 줄의 수
    for (let i = 0; i < clearedLines; i++) {
      newBoard.unshift(Array(this.M).fill('')); // 빈 줄 추가
    }
  
    this.board = newBoard;
    this.score += clearedLines * 10; // 점수 추가
  }
  
  
}
