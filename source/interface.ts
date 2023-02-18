export interface Cell {
  isMine: boolean;
  isFlag: boolean;
  isOpen: boolean;
  minesAround: number;
}

export type Position = [number, number];

export interface GameStore {
  cells: Cell[][];
  status: "ready" | "playing" | "win" | "fail";
  cursorPosition: Position;
}
