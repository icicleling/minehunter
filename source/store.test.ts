import test from "ava";
import { Difficulty, EASY_DIFFICULTY_CONFIG } from "./constants.js";
import { GameStore, Position } from "./interface.js";
import { actions, reducer } from "./store.js";
import { getCell, getInitialState, getReadyCells } from "./utils.js";

test("initial cursor position should be [0,0]", (t) => {
  const state = getInitialState();

  const position = reducer(state, { type: undefined }).cursorPosition;

  t.deepEqual(position, [0, 0]);
});

test("initial field size should be 0", (t) => {
  const state = getInitialState();

  const size = reducer(state, { type: undefined }).cells.length;

  t.is(size, 0);
});

test("initial game status should be 'menu'", (t) => {
  const state = getInitialState();

  const status = reducer(state, { type: undefined }).status;

  t.is(status, "menu");
});

test("basic move", (t) => {
  const state = getInitialState({
    cells: getReadyCells(9, 9),
    status: "playing",
    cursorPosition: [1, 1],
  });

  const postionAfterUp = reducer(state, actions.up()).cursorPosition;
  const positionAfterDown = reducer(state, actions.down()).cursorPosition;
  const positionAfterLeft = reducer(state, actions.left()).cursorPosition;
  const positionAfterRight = reducer(state, actions.right()).cursorPosition;

  t.deepEqual(postionAfterUp, [1, 0]);
  t.deepEqual(positionAfterDown, [1, 2]);
  t.deepEqual(positionAfterLeft, [0, 1]);
  t.deepEqual(positionAfterRight, [2, 1]);
});

test("edge movement should not work", (t) => {
  const topLeftPosition: Position = [0, 0];
  const bottomRightPosition: Position = [8, 8];
  const state = getInitialState();

  const postionAfterUp = reducer(
    { ...state, cursorPosition: topLeftPosition },
    actions.up()
  ).cursorPosition;
  const positionAfterDown = reducer(
    { ...state, cursorPosition: bottomRightPosition },
    actions.down()
  ).cursorPosition;
  const positionAfterLeft = reducer(
    { ...state, cursorPosition: topLeftPosition },
    actions.left()
  ).cursorPosition;
  const positionAfterRight = reducer(
    { ...state, cursorPosition: bottomRightPosition },
    actions.right()
  ).cursorPosition;

  t.deepEqual(postionAfterUp, [0, 0]);
  t.deepEqual(positionAfterDown, [8, 8]);
  t.deepEqual(positionAfterLeft, [0, 0]);
  t.deepEqual(positionAfterRight, [8, 8]);
});

test("restart should reset game store", (t) => {
  const changedState = getInitialState({
    cursorPosition: [5, 5],
    status: "win",
  });
  const initialState = getInitialState();

  const restartState = reducer(changedState, actions.restart());

  t.deepEqual(restartState, initialState);
});

test("flag should be invalid when the status is not palying", (t) => {
  const winState = getInitialState({
    cells: [[{ ...getCell() }]],
    status: "win",
  });
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
  const state = getInitialState({
    cells: [[{ ...getCell({ isOpen: true }) }]],
    status: "playing",
  });

  const flagAfterInOpenedStatus = reducer(state, actions.flag()).cells[0]?.[0]
    ?.isFlag;

  t.false(flagAfterInOpenedStatus);
});

test("flag toggle", (t) => {
  const state = getInitialState({
    cells: [[getCell(), getCell({ isMine: true })]],
    status: "playing",
  });

  const toggleFlagOnce = reducer(state, actions.flag());
  const toggleFlagTwice = reducer(toggleFlagOnce, actions.flag());
  const flagToggleFlagOnce = toggleFlagOnce.cells[0]?.[0]?.isFlag;
  const flagToggleFlagTwice = toggleFlagTwice.cells[0]?.[0]?.isFlag;

  t.true(flagToggleFlagOnce);
  t.false(flagToggleFlagTwice);
});

test("flag all mines the game status should be win", (t) => {
  const state = getInitialState({
    cells: [[getCell({ isMine: true })]],
    status: "playing",
  });

  const statusAfterFlagState = reducer(state, actions.flag()).status;

  t.is(statusAfterFlagState, "win");
});

test("open should be invalid when the status is win and fail", (t) => {
  const winState = getInitialState({
    cells: [[{ ...getCell() }]],
    status: "win",
  });
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
  const readyState = getInitialState({
    cells: getReadyCells(
      EASY_DIFFICULTY_CONFIG.fieldWidthSize,
      EASY_DIFFICULTY_CONFIG.fieldHeightSize
    ),
    status: "ready",
  });

  const isMinesInState = reducer(readyState, actions.open).cells.some((cells) =>
    cells.some((item) => item.isMine)
  );

  t.true(isMinesInState);
});

test("no mines around the cell when first open", (t) => {
  const testFunc = () => {
    const readyState = getInitialState({
      cells: getReadyCells(
        EASY_DIFFICULTY_CONFIG.fieldWidthSize,
        EASY_DIFFICULTY_CONFIG.fieldHeightSize
      ),
      cursorPosition: [5, 5],
      status: "ready",
    });

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
  const state = getInitialState({
    cells,
    status: "playing",
  });

  const cellsAfterOpen = reducer(state, actions.open()).cells;

  t.true(cellsAfterOpen[0]?.[0]?.isOpen);
  t.true(cellsAfterOpen[0]?.[1]?.isOpen);
  t.true(cellsAfterOpen[1]?.[0]?.isOpen);
  t.true(cellsAfterOpen[1]?.[1]?.isOpen);
});

test("game over if you open the mine", (t) => {
  const cells = [[getCell({ minesAround: 1 }), getCell({ isMine: true })]];
  const state = getInitialState({
    cells,
    cursorPosition: [1, 0],
    status: "playing",
  });

  const status = reducer(state, actions.open).status;

  t.is(status, "fail");
});

test("open all not mine cell, game won", (t) => {
  const cells = [
    [getCell(), getCell({ minesAround: 1 }), getCell({ isMine: true })],
  ];
  const state = getInitialState({
    cells,
    status: "playing",
  });

  const status = reducer(state, actions.open).status;

  t.is(status, "win");
});

test("check for changes in difficulty", (t) => {
  const state = getInitialState();

  const mediumDifficulty = reducer(
    state,
    actions.setDifficulty(Difficulty.Medium)
  ).difficulty;

  const hardDifficulty = reducer(
    state,
    actions.setDifficulty(Difficulty.Hard)
  ).difficulty;

  t.is(mediumDifficulty, Difficulty.Medium);
  t.is(hardDifficulty, Difficulty.Hard);
});

test("change the difficulty should generate a different field and mines", (t) => {
  const state = getInitialState();

  const mediumState = reducer(state, actions.setDifficulty(Difficulty.Medium));
  const hardState = reducer(state, actions.setDifficulty(Difficulty.Hard));

  t.is(mediumState.cells.length, 16);
  t.is(mediumState.cells?.[0]?.length, 16);
  t.is(hardState.cells.length, 16);
  t.is(hardState.cells?.[0]?.length, 30);
});

test("status should be ready after changing the difficulty", (t) => {
  const state = getInitialState();

  const status = reducer(
    state,
    actions.setDifficulty(Difficulty.Medium)
  ).status;

  t.is(status, "ready");
});
