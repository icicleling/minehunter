import reduxToolkit from "@reduxjs/toolkit";
import { Cell, GameStore } from "./interface.js";
import { generateMinePositions, getAroundMinesTotal } from "./utils.js";
const { configureStore, createSlice } = reduxToolkit;

const FIELD_WIDTH_SIZE = 9;
const FIELD_HEIGHT_SIZE = 9;
const MINES_COUNT = 10;

const cells: Cell[][] = [...Array(FIELD_WIDTH_SIZE).keys()].map(() =>
  [...Array(FIELD_HEIGHT_SIZE).keys()].map(
    (): Cell => ({
      isMine: false,
      isFlag: false,
      isOpen: false,
      minesAround: 0,
    })
  )
);

const initialState: GameStore = {
  cells,
  status: "ready",
  cursorPosition: [0, 0],
};

const gameStore = createSlice({
  name: "game",
  initialState,
  reducers: {
    open(state) {
      if (state.status === "ready") {
        const minePostions = generateMinePositions(
          FIELD_WIDTH_SIZE,
          FIELD_HEIGHT_SIZE,
          MINES_COUNT
        );

        minePostions.forEach(([x, y]) => {
          state.cells[y]![x]!.isMine = true;
        });

        state.cells.forEach((row, y) => {
          row.forEach((cell, x) => {
            cell.minesAround = getAroundMinesTotal(
              FIELD_WIDTH_SIZE,
              FIELD_HEIGHT_SIZE,
              [x, y],
              state.cells
            );
          });
        });

        state.status = "playing";
      }
      const [x, y] = state.cursorPosition;
      const cell = state.cells[y]![x]!;
      if (cell.isFlag) return;
      cell.isOpen = true;
    },
    flag(state) {
      const [x, y] = state.cursorPosition;
      const cell = state.cells[y]![x]!;
      cell.isFlag = !cell.isFlag;
    },
    up(state) {
      const [x, y] = state.cursorPosition;
      state.cursorPosition = [x, y - 1];
    },
    down(state) {
      const [x, y] = state.cursorPosition;
      state.cursorPosition = [x, y + 1];
    },
    left(state) {
      const [x, y] = state.cursorPosition;
      state.cursorPosition = [x - 1, y];
    },
    right(state) {
      const [x, y] = state.cursorPosition;
      state.cursorPosition = [x + 1, y];
    },
  },
});

export const { actions } = gameStore;

const store = configureStore({
  reducer: gameStore.reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
