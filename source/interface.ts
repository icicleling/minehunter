import { Difficulty } from "./constants.js";

export interface Cell {
  isMine: boolean;
  isFlag: boolean;
  isOpen: boolean;
  minesAround: number;
}

export type Position = [number, number];

export interface DifficultyConfig {
  fieldWidthSize: number;
  fieldHeightSize: number;
  minesCount: number;
}

export interface GameStore {
  cells: Cell[][];
  status: "menu" | "ready" | "playing" | "win" | "fail";
  cursorPosition: Position;
  difficulty: Difficulty;
}
