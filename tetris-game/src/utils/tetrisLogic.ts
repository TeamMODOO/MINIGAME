// tetrisLogic.ts

import blocks from './blocks';

export class Tetris {
  N: number;
  M: number;
  score: number;
  level: number;
  duration: number;
  movingBlock?: { type: string; direction: number; n: number; m: number };
  nextBlocks: string[];
  board: string[][];
  gameOver: boolean;

  constructor() {
    this.N = 20; // 보드 세로 길이
    this.M = 10; // 보드 가로 길이
    this.score = 0;
    this.level = 1;
    this.duration = 1000;
    this.nextBlocks = [];
    this.board = this.createEmptyBoard();
    this.gameOver = false; // 게임 종료 상태
  }

  // 빈 보드 생성
  createEmptyBoard(): string[][] {
    return Array.from({ length: this.N }, () => Array(this.M).fill(''));
  }

  // 보드 데이터를 반환
  getBoard(): string[][] {
    return this.board.map(row => [...row]); // 보드의 복사본 반환
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

  // 다음 블록 생성 (추가된 함수)
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
  
    this.movingBlock = { type: next, direction: 0, n: 0, m: Math.floor(this.M / 2) - 2 };
  
    if (this.isColliding(this.movingBlock.n, this.movingBlock.m, this.movingBlock.direction)) {
      this.gameOver = true; // 게임 종료 상태 업데이트
      return; // 새 블록을 만들지 않고 종료
    }
  
    this.renderBlock();
    this.makeNextBlock(); // 다음 블록 큐에 새로운 블록 추가
  }
  

  // 충돌 감지
  isColliding(n: number, m: number, direction: number): boolean {
    const type = this.movingBlock?.type || '';
    return blocks[type][direction].some(([x, y]) => {
      const newX = n + y; // y와 x를 바꿔야 할 수 있음
      const newY = m + x;
      return (
        newX < 0 ||
        newX >= this.N ||
        newY < 0 ||
        newY >= this.M ||
        this.board[newX][newY] === 'fixed'
      );
    });
  }

  // 블록 렌더링
  renderBlock(): void {
    if (!this.movingBlock) return;

    const { type, direction, n, m } = this.movingBlock;

    // 기존 active 블록 제거
    this.clearMovingBlock();

    const isColliding = this.isColliding(n, m, direction);

    if (isColliding) {
      this.finishBlock(); // 충돌 시 현재 블록 고정
      return;
    }

    // 이동 중인 블록 렌더링
    blocks[type][direction].forEach(([x, y]) => {
      const newX = n + y; // y와 x를 바꿔야 할 수 있음
      const newY = m + x;
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

  // 블록 고정
  finishBlock(): void {
    if (!this.movingBlock) return;

    const { type, direction, n, m } = this.movingBlock;

    // 현재 블록을 고정 상태로 설정
    blocks[type][direction].forEach(([x, y]) => {
      const newX = n + y; // y와 x를 바꿔야 할 수 있음
      const newY = m + x;
      if (this.board[newX]) {
        this.board[newX][newY] = 'fixed'; // 고정 상태로 설정
      }
    });

    this.checkFullLines(); // 가득 찬 줄 제거
    this.makeNewBlock(); // 새로운 블록 생성
  }

  // 완전히 채워진 줄 제거
  checkFullLines(): void {
    const linesToRemove: number[] = [];

    this.board.forEach((row, index) => {
      if (row.every(cell => cell === 'fixed')) {
        linesToRemove.push(index);
      }
    });

    linesToRemove.forEach(lineIndex => {
      this.board.splice(lineIndex, 1);
      this.board.unshift(Array(this.M).fill(''));
    });

    this.score += linesToRemove.length * 10; // 점수 추가
  }

  // 블록 이동
  moveBlock(where: 'n' | 'm' | 'rotate', amount: number): void {
    if (!this.movingBlock) return;
  
    const nextPosition = { ...this.movingBlock };
  
    if (where === 'rotate') {
      nextPosition.direction = (this.movingBlock.direction + amount + 4) % 4; // 방향을 0~3 사이로 유지
    } else {
      nextPosition[where] += amount;
    }
  
    // 충돌 감지
    if (this.isColliding(nextPosition.n, nextPosition.m, nextPosition.direction)) {
      if (where === 'n') {
        this.finishBlock(); // 아래로 이동 중 충돌 시 블록 고정
      }
      return;
    }
  
    // 이동 허용
    if (where === 'rotate') {
      this.movingBlock.direction = nextPosition.direction; // 회전 적용
    } else {
      this.movingBlock[where] += amount; // 이동 적용
    }
  
    this.renderBlock();
  }
  
}
