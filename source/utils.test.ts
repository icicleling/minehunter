import test from "ava";
import { Difficulty } from "./constants.js";
import { Cell, GameStore, Position } from "./interface.js";
import {
  checkWin,
  generateMinePositions,
  getAllPositions,
  getAroundMinesTotal,
  getAroundPositions,
  getCell,
  getDiffcultyConfig,
  getFieldSize,
  getInitialState,
  getReadyCells,
} from "./utils.js";

test("get all positions by width size and height size", (t) => {
  const positions = getAllPositions(2, 3);
  const correctPostions = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
  ];

  t.deepEqual(positions, correctPostions);
});

test("the number of mine positions generated should be equal to the minesCount", (t) => {
  const minesCount = 10;

  const positions = generateMinePositions(9, 9, minesCount, [0, 0]);

  t.is(positions.length, 10);
});

test("the generated mine positions should not have firstOpenPosition and firstOpenPosition's surrounding positions", (t) => {
  const minesCount = 100;
  const firstOpenPosition: Position = [5, 5];
  const firstOpenAndSurroundPosition: Position[] = [
    [4, 4],
    [5, 4],
    [6, 4],
    [4, 5],
    [5, 5],
    [6, 5],
    [4, 6],
    [5, 6],
    [6, 6],
  ];

  const positions = generateMinePositions(9, 9, minesCount, firstOpenPosition);

  const result = positions.find(([x, y]) =>
    firstOpenAndSurroundPosition.find(([fx, fy]) => fx === x && fy === y)
  );

  t.is(result, undefined);
});

test("get around positions, leftTop, center and rightBottom", (t) => {
  const fieldSize = 20;
  const leftTopPosition: Position = [0, 0];
  const centerPosition: Position = [10, 10];
  const rightBottomPosition: Position = [19, 19];

  const correctLeftTopPostions: Position[] = [
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  const correctCenterPostions: Position[] = [
    [9, 9],
    [9, 10],
    [9, 11],
    [10, 9],
    [10, 11],
    [11, 9],
    [11, 10],
    [11, 11],
  ];
  const correctRightBottomPostions: Position[] = [
    [18, 18],
    [18, 19],
    [19, 18],
  ];

  const leftTopAroundPositions = getAroundPositions(
    fieldSize,
    fieldSize,
    leftTopPosition
  );
  const centerAroundPositions = getAroundPositions(
    fieldSize,
    fieldSize,
    centerPosition
  );
  const rightBottomAroundPositions = getAroundPositions(
    fieldSize,
    fieldSize,
    rightBottomPosition
  );

  t.deepEqual(leftTopAroundPositions, correctLeftTopPostions);
  t.deepEqual(centerAroundPositions, correctCenterPostions);
  t.deepEqual(rightBottomAroundPositions, correctRightBottomPostions);
});

test("get around mines total", (t) => {
  const position1: Position = [0, 0];
  const position2: Position = [2, 1];
  const position3: Position = [2, 2];
  const cells: Cell[][] = [
    [getCell(), getCell({ isMine: true }), getCell()],
    [getCell(), getCell({ isMine: true }), getCell()],
    [getCell(), getCell(), getCell()],
  ];

  const minesTotal1 = getAroundMinesTotal(position1, cells);
  const minesTotal2 = getAroundMinesTotal(position2, cells);
  const minesTotal3 = getAroundMinesTotal(position3, cells);

  t.is(minesTotal1, 2);
  t.is(minesTotal2, 2);
  t.is(minesTotal3, 1);
});

test("check the fields of the get cell ", (t) => {
  const cell = getCell();
  const fieldsLength = Object.keys(cell).length;

  t.is(fieldsLength, 4);
  t.false(cell.isFlag);
  t.false(cell.isMine);
  t.false(cell.isOpen);
  t.is(cell.minesAround, 0);
});

test("get the cell that override some fields", (t) => {
  const cell = getCell({ minesAround: 1, isFlag: true });

  t.true(cell.isFlag);
  t.false(cell.isMine);
  t.is(cell.minesAround, 1);
});

test("check size of the get ready cells", (t) => {
  const cells = getReadyCells(10, 15);

  t.is(cells?.[0]?.length, 10);
  t.is(cells.length, 15);
});

test("check win status, win", (t) => {
  const cellsOpenAllSafe: Cell[][] = [
    [
      getCell({ isOpen: true }),
      getCell({ isOpen: true }),
      getCell({ isMine: true }),
    ],
    [
      getCell({ isOpen: true }),
      getCell({ isOpen: true }),
      getCell({ isMine: true }),
    ],
  ];

  const cellsFlagAllMines: Cell[][] = [
    [getCell(), getCell(), getCell({ isMine: true, isFlag: true })],
    [getCell(), getCell({ isMine: true, isFlag: true }), getCell()],
  ];

  const cellsNoMines: Cell[][] = [
    [getCell(), getCell(), getCell()],
    [getCell(), getCell(), getCell()],
  ];

  const isWinOpenAllSafeCells = checkWin(cellsOpenAllSafe);
  const isWinFlagAllMineCells = checkWin(cellsFlagAllMines);
  const isWinNoMines = checkWin(cellsNoMines);

  t.true(isWinOpenAllSafeCells);
  t.true(isWinFlagAllMineCells);
  t.true(isWinNoMines);
});

test("check win status, no win", (t) => {
  const cellsEmpty: Cell[][] = [];
  const cellsNoWin1: Cell[][] = [
    [getCell(), getCell(), getCell({ isMine: true })],
    [getCell(), getCell(), getCell()],
  ];
  const cellsNoWin2: Cell[][] = [
    [getCell({ isOpen: true }), getCell({ isOpen: true }), getCell()],
    [
      getCell(),
      getCell({ isMine: true }),
      getCell({ isFlag: true, isMine: true }),
    ],
  ];

  const isWinEmpty = checkWin(cellsEmpty);
  const isWin1 = checkWin(cellsNoWin1);
  const isWin2 = checkWin(cellsNoWin2);

  t.false(isWinEmpty);
  t.false(isWin1);
  t.false(isWin2);
});

test("get cells size", (t) => {
  const cells1: Cell[][] = [
    [getCell(), getCell()],
    [getCell(), getCell()],
  ];
  const cells2: Cell[][] = [
    [getCell(), getCell(), getCell(), getCell()],
    [getCell(), getCell(), getCell(), getCell()],
    [getCell(), getCell(), getCell(), getCell()],
  ];

  const cells1Size = getFieldSize(cells1);
  const cells2Size = getFieldSize(cells2);

  t.is(cells1Size.fieldWidth, 2);
  t.is(cells1Size.fieldHeight, 2);
  t.is(cells2Size.fieldWidth, 4);
  t.is(cells2Size.fieldHeight, 3);
});

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
