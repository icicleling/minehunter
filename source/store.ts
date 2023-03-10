import reduxToolkit from "@reduxjs/toolkit";
import { Cell, GameStore, Position } from "./interface.js";
import {
  checkWin,
  generateMinePositions,
  getAroundMinesTotal,
  getAroundPositions,
  getFieldSize,
  getReadyCells,
} from "./utils.js";
const { configureStore, createSlice } = reduxToolkit;

export const FIELD_WIDTH_SIZE = 9;
export const FIELD_HEIGHT_SIZE = 9;
export const MINES_COUNT = 10;

const cells: Cell[][] = getReadyCells(FIELD_WIDTH_SIZE, FIELD_HEIGHT_SIZE);

export const initialState: GameStore = {
  cells,
  status: "ready",
  cursorPosition: [0, 0],
};

const gameStore = createSlice({
  name: "game",
  initialState,
  reducers: {
    open(state) {
      if (state.status === "win" || state.status === "fail") return;
      if (state.status === "ready") {
        const minePostions = generateMinePositions(
          FIELD_WIDTH_SIZE,
          FIELD_HEIGHT_SIZE,
          MINES_COUNT,
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
    restart(state) {
      state.cells = initialState.cells;
      state.cursorPosition = initialState.cursorPosition;
      state.status = initialState.status;
    },
    up(state) {
      const [x, y] = state.cursorPosition;
      if (y - 1 < 0) return;
      state.cursorPosition = [x, y - 1];
    },
    down(state) {
      const [x, y] = state.cursorPosition;
      if (y + 1 > FIELD_HEIGHT_SIZE - 1) return;
      state.cursorPosition = [x, y + 1];
    },
    left(state) {
      const [x, y] = state.cursorPosition;
      if (x - 1 < 0) return;
      state.cursorPosition = [x - 1, y];
    },
    right(state) {
      const [x, y] = state.cursorPosition;
      if (x + 1 > FIELD_WIDTH_SIZE - 1) return;
      state.cursorPosition = [x + 1, y];
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
