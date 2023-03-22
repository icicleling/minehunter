import { DifficultyConfig } from "./interface.js";

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export const EASY_DIFFICULTY_CONFIG: DifficultyConfig = {
  fieldWidthSize: 9,
  fieldHeightSize: 9,
  minesCount: 10,
};

export const MEDIUM_DIFFICULTY_CONFIG: DifficultyConfig = {
  fieldWidthSize: 16,
  fieldHeightSize: 16,
  minesCount: 40,
};

export const HARD_DIFFICULTY_CONFIG: DifficultyConfig = {
  fieldWidthSize: 30,
  fieldHeightSize: 16,
  minesCount: 99,
};
