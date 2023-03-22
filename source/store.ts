import reduxToolkit, { PayloadAction } from "@reduxjs/toolkit";
import { Difficulty } from "./constants.js";
import { Position } from "./interface.js";
import {
  checkWin,
  generateMinePositions,
  getAroundMinesTotal,
  getAroundPositions,
  getDiffcultyConfig,
  getFieldSize,
  getInitialState,
  getReadyCells,
} from "./utils.js";
const { configureStore, createSlice } = reduxToolkit;

const gameStore = createSlice({
  name: "game",
  initialState: getInitialState(),
  reducers: {
    open(state) {
      if (state.status === "win" || state.status === "fail") return;
      if (state.status === "ready") {
        const { fieldWidthSize, fieldHeightSize, minesCount } =
          getDiffcultyConfig(state.difficulty);

        const minePostions = generateMinePositions(
          fieldWidthSize,
          fieldHeightSize,
          minesCount,
          state.cursorPosition
        );

        minePostions.forEach(([x, y]) => {
          const cell = state.cells[y]?.[x];
          if (!cell) return;
          cell.isMine = true;
        });

        state.cells.forEach((row, y) => {
          row.forEach((cell, x) => {
            cell.minesAround = getAroundMinesTotal([x, y], state.cells);
          });
        });

        state.status = "playing";
      }

      const openCell = ([x, y]: Position) => {
        const cell = state.cells[y]?.[x];
        if (!cell) return;

        if (cell.isFlag || cell.isOpen) return;
        cell.isOpen = true;
        if (cell.isMine === true) state.status = "fail";

        if (cell.isMine || cell.minesAround) return;
        const { fieldWidth, fieldHeight } = getFieldSize(state.cells);
        const aroundPositions = getAroundPositions(fieldWidth, fieldHeight, [
          x,
          y,
        ]);
        aroundPositions.map((position) => openCell(position));
      };
      openCell(state.cursorPosition);

      if (checkWin(state.cells)) state.status = "win";
    },
    flag(state) {
      if (state.status !== "playing") return;

      const [x, y] = state.cursorPosition;
      const cell = state.cells[y]?.[x];
      if (!cell || cell.isOpen) return;
      cell.isFlag = !cell.isFlag;

      if (checkWin(state.cells)) state.status = "win";
    },
    restart() {
      return getInitialState();
    },
    up(state) {
      const [x, y] = state.cursorPosition;
      if (y - 1 < 0) return;
      state.cursorPosition = [x, y - 1];
    },
    down(state) {
      const [x, y] = state.cursorPosition;
      if (y + 1 > state.cells.length - 1) return;
      state.cursorPosition = [x, y + 1];
    },
    left(state) {
      const [x, y] = state.cursorPosition;
      if (x - 1 < 0) return;
      state.cursorPosition = [x - 1, y];
    },
    right(state) {
      const [x, y] = state.cursorPosition;
      const rowLength = state.cells?.[0]?.length;
      if (!rowLength) return;
      if (x + 1 > rowLength - 1) return;
      state.cursorPosition = [x + 1, y];
    },
    setDifficulty(state, action: PayloadAction<Difficulty>) {
      state.difficulty = action.payload;
      state.status = "ready";
      const { fieldWidthSize, fieldHeightSize } = getDiffcultyConfig(
        action.payload
      );
      state.cells = getReadyCells(fieldWidthSize, fieldHeightSize);
    },
  },
});

export const { actions, reducer } = gameStore;

const store = configureStore({
  reducer: gameStore.reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
