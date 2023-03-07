import test from "ava";
import { GameStore, Position } from "./interface.js";
import {
  actions,
  FIELD_HEIGHT_SIZE,
  FIELD_WIDTH_SIZE,
  initialState,
  reducer,
} from "./store.js";
import { getCell, getReadyCells } from "./utils.js";

test("initial cursor position should be [0,0]", (t) => {
  const position = reducer(initialState, { type: undefined }).cursorPosition;

  t.deepEqual(position, [0, 0]);
});

test("initial field size should be 9x9", (t) => {
  const heightSize = reducer(initialState, { type: undefined }).cells.length;
  const widthSize = reducer(initialState, { type: undefined }).cells[0]?.length;

  t.is(heightSize, 9);
  t.is(widthSize, 9);
});

test("initial game status should be 'ready'", (t) => {
  const status = reducer(initialState, { type: undefined }).status;

  t.is(status, "ready");
});

test("basic move", (t) => {
  const cursorPosition: Position = [1, 1];

  const postionAfterUp = reducer(
    { ...initialState, cursorPosition },
    actions.up()
  ).cursorPosition;
  const positionAfterDown = reducer(
    { ...initialState, cursorPosition },
    actions.down()
  ).cursorPosition;
  const positionAfterLeft = reducer(
    { ...initialState, cursorPosition },
    actions.left()
  ).cursorPosition;
  const positionAfterRight = reducer(
    { ...initialState, cursorPosition },
    actions.right()
  ).cursorPosition;

  t.deepEqual(postionAfterUp, [1, 0]);
  t.deepEqual(positionAfterDown, [1, 2]);
  t.deepEqual(positionAfterLeft, [0, 1]);
  t.deepEqual(positionAfterRight, [2, 1]);
});

test("edge movement should not work", (t) => {
  const topLeftPosition: Position = [0, 0];
  const bottomRightPosition: Position = [8, 8];

  const postionAfterUp = reducer(
    { ...initialState, cursorPosition: topLeftPosition },
    actions.up()
  ).cursorPosition;
  const positionAfterDown = reducer(
    { ...initialState, cursorPosition: bottomRightPosition },
    actions.down()
  ).cursorPosition;
  const positionAfterLeft = reducer(
    { ...initialState, cursorPosition: topLeftPosition },
    actions.left()
  ).cursorPosition;
  const positionAfterRight = reducer(
    { ...initialState, cursorPosition: bottomRightPosition },
    actions.right()
  ).cursorPosition;

  t.deepEqual(postionAfterUp, [0, 0]);
  t.deepEqual(positionAfterDown, [8, 8]);
  t.deepEqual(positionAfterLeft, [0, 0]);
  t.deepEqual(positionAfterRight, [8, 8]);
});

test("restart should reset game store", (t) => {
  const changedState: GameStore = {
    cells: [],
    cursorPosition: [5, 5],
    status: "win",
  };

  const restartState = reducer(changedState, actions.restart());

  t.deepEqual(restartState, initialState);
});

test("flag should be invalid when the status is not palying", (t) => {
  const winState: GameStore = {
    cells: [[{ ...getCell() }]],
    cursorPosition: [0, 0],
    status: "win",
  };
  const failState: GameStore = {
    ...winState,
    status: "fail",
  };
  const readyState: GameStore = {
    ...winState,
    status: "ready",
  };

  const flagAfterInWinStatus = reducer(winState, actions.flag()).cells[0]?.[0]
    ?.isFlag;
  const flagAfterInFailStatus = reducer(failState, actions.flag()).cells[0]?.[0]
    ?.isFlag;
  const flagAfterInReadyStatus = reducer(readyState, actions.flag())
    .cells[0]?.[0]?.isFlag;

  t.false(flagAfterInWinStatus);
  t.false(flagAfterInFailStatus);
  t.false(flagAfterInReadyStatus);
});

test("flag should be invalid when the cell is opened", (t) => {
  const state: GameStore = {
    cells: [[{ ...getCell({ isOpen: true }) }]],
    cursorPosition: [0, 0],
    status: "playing",
  };

  const flagAfterInOpenedStatus = reducer(state, actions.flag()).cells[0]?.[0]
    ?.isFlag;

  t.false(flagAfterInOpenedStatus);
});

test("flag toggle", (t) => {
  const state: GameStore = {
    cells: [[getCell(), getCell({ isMine: true })]],
    cursorPosition: [0, 0],
    status: "playing",
  };

  const toggleFlagOnce = reducer(state, actions.flag());
  const toggleFlagTwice = reducer(toggleFlagOnce, actions.flag());
  const flagToggleFlagOnce = toggleFlagOnce.cells[0]?.[0]?.isFlag;
  const flagToggleFlagTwice = toggleFlagTwice.cells[0]?.[0]?.isFlag;

  t.true(flagToggleFlagOnce);
  t.false(flagToggleFlagTwice);
});

test("flag all mines the game status should be win", (t) => {
  const state: GameStore = {
    cells: [[getCell({ isMine: true })]],
    cursorPosition: [0, 0],
    status: "playing",
  };

  const statusAfterFlagState = reducer(state, actions.flag()).status;

  t.is(statusAfterFlagState, "win");
});

test("open should be invalid when the status is win and fail", (t) => {
  const winState: GameStore = {
    cells: [[{ ...getCell() }]],
    cursorPosition: [0, 0],
    status: "win",
  };
  const failState: GameStore = {
    ...winState,
    status: "fail",
  };

  const openAfterInWinStatus = reducer(winState, actions.open()).cells[0]?.[0]
    ?.isOpen;
  const openAfterInFailStatus = reducer(failState, actions.open()).cells[0]?.[0]
    ?.isOpen;

  t.false(openAfterInWinStatus);
  t.false(openAfterInFailStatus);
});

test("generates mines after first open", (t) => {
  const readyState: GameStore = {
    cells: getReadyCells(FIELD_WIDTH_SIZE, FIELD_HEIGHT_SIZE),
    cursorPosition: [0, 0],
    status: "ready",
  };

  const isMinesInState = reducer(readyState, actions.open).cells.some((cells) =>
    cells.some((item) => item.isMine)
  );

  t.true(isMinesInState);
});

test("no mines around the cell when first open", (t) => {
  const testFunc = () => {
    const readyState: GameStore = {
      cells: getReadyCells(FIELD_WIDTH_SIZE, FIELD_HEIGHT_SIZE),
      cursorPosition: [5, 5],
      status: "ready",
    };

    const noMinesPositions: Position[] = (
      [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ] as const
    ).map(([xOffset, yOffset]) => [
      readyState.cursorPosition[0] + xOffset,
      readyState.cursorPosition[1] + yOffset,
    ]);

    const cellsAfterOpen = reducer(readyState, actions.open).cells;
    const isNoMines = noMinesPositions.every(
      ([x, y]) => cellsAfterOpen[x]?.[y]?.isMine === false
    );

    t.true(isNoMines);
  };

  for (let index = 0; index < 5; index++) {
    testFunc();
  }
});

test("when a cell is opened, the adjacent 0 mines cell and it around should also be opened", (t) => {
  const cells = [
    [getCell(), getCell()],
    [getCell({ minesAround: 1 }), getCell({ minesAround: 1 })],
    [getCell({ minesAround: 1 }), getCell({ isMine: true })],
  ];
  const state: GameStore = {
    cells,
    cursorPosition: [0, 0],
    status: "playing",
  };

  const cellsAfterOpen = reducer(state, actions.open()).cells;

  t.true(cellsAfterOpen[0]?.[0]?.isOpen);
  t.true(cellsAfterOpen[0]?.[1]?.isOpen);
  t.true(cellsAfterOpen[1]?.[0]?.isOpen);
  t.true(cellsAfterOpen[1]?.[1]?.isOpen);
});

test("game over if you open the mine", (t) => {
  const cells = [[getCell({ minesAround: 1 }), getCell({ isMine: true })]];
  const state: GameStore = {
    cells,
    cursorPosition: [1, 0],
    status: "playing",
  };

  const status = reducer(state, actions.open).status;

  t.is(status, "fail");
});

test("open all not mine cell, game won", (t) => {
  const cells = [
    [getCell(), getCell({ minesAround: 1 }), getCell({ isMine: true })],
  ];
  const state: GameStore = {
    cells,
    cursorPosition: [0, 0],
    status: "playing",
  };

  const status = reducer(state, actions.open).status;

  t.is(status, "win");
});
