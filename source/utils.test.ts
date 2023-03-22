import test from "ava";
import { Difficulty } from "./constants.js";
import { GameStore } from "./interface.js";
import { getDiffcultyConfig, getInitialState } from "./utils.js";

test("get default initialState", (t) => {
  const state = getInitialState();
  const initialState: GameStore = {
    cells: [],
    cursorPosition: [0, 0],
    difficulty: Difficulty.Easy,
    status: "menu",
  };

  t.deepEqual(state, initialState);
});

test("get the initialState that override some fields", (t) => {
  const state = getInitialState({ status: "win", difficulty: Difficulty.Hard });

  t.is(state.status, "win");
  t.is(state.difficulty, Difficulty.Hard);
});

test("get constants diffculty config by diffculty", (t) => {
  const easyConfig = getDiffcultyConfig(Difficulty.Easy);
  const mediumConfig = getDiffcultyConfig(Difficulty.Medium);
  const hardConfig = getDiffcultyConfig(Difficulty.Hard);

  t.is(easyConfig.fieldWidthSize, 9);
  t.is(easyConfig.fieldHeightSize, 9);
  t.is(easyConfig.minesCount, 10);
  t.is(mediumConfig.fieldWidthSize, 16);
  t.is(mediumConfig.fieldHeightSize, 16);
  t.is(mediumConfig.minesCount, 40);
  t.is(hardConfig.fieldWidthSize, 30);
  t.is(hardConfig.fieldHeightSize, 16);
  t.is(hardConfig.minesCount, 99);
});
