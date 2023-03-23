import randomInteger from "random-int";
import {
  Difficulty,
  EASY_DIFFICULTY_CONFIG,
  HARD_DIFFICULTY_CONFIG,
  MEDIUM_DIFFICULTY_CONFIG,
} from "./constants.js";
import { Cell, DifficultyConfig, GameStore, Position } from "./interface.js";

export const getAllPositions = (
  fieldWidth: number,
  fieldHeight: number
): Position[] => {
  return [...Array(fieldWidth).keys()]
    .map((x) => [...Array(fieldHeight).keys()].map((y) => [x, y] as Position))
    .flat();
};

export const generateMinePositions = (
  fieldWidth: number,
  fieldHeight: number,
  minesCount: number,
  firstOpenPosition: Position
): Position[] => {
  const noMinePositions = getAroundPositions(
    fieldWidth,
    fieldHeight,
    firstOpenPosition
  ).concat([firstOpenPosition]);

  const allPositions = getAllPositions(fieldWidth, fieldHeight).filter(
    ([x, y]) => !noMinePositions.find(([nx, ny]) => nx === x && ny === y)
  );

  const minePostions: Position[] = [];
  for (let i = 0; i < minesCount; i++) {
    if (!allPositions.length) break;
    const index = randomInteger(0, allPositions.length - 1);
    const position = allPositions[index];
    /* c8 ignore next */
    if (!position) throw RangeError();
    minePostions.push(position);
    allPositions.splice(index, 1);
  }
  return minePostions;
};

export const getAroundPositions = (
  fieldWidth: number,
  fieldHeight: number,
  [x, y]: Position
) => {
  const aroundPositions: Position[] = [-1, 0, 1]
    .map((xOffset) =>
      [-1, 0, 1].map((yOffset) => [x + xOffset, y + yOffset] as Position)
    )
    .flat();
  aroundPositions.splice(4, 1); // remove central cell
  return aroundPositions.filter(
    ([x, y]) => x >= 0 && x < fieldWidth && y >= 0 && y < fieldHeight
  );
};

export const getAroundMinesTotal = (
  [x, y]: Position,
  cells: Readonly<GameStore["cells"]>
) => {
  const { fieldWidth, fieldHeight } = getFieldSize(cells);
  const aroundPositions = getAroundPositions(fieldWidth, fieldHeight, [x, y]);

  return aroundPositions.reduce((prev, [x, y]) => {
    if (cells[y]?.[x]?.isMine) return prev + 1;
    return prev;
  }, 0);
};

export const getCell = (cell?: Partial<Cell>): Cell => ({
  isMine: false,
  isFlag: false,
  isOpen: false,
  minesAround: 0,
  ...cell,
});

export const getReadyCells = (
  fieldWidth: number,
  fieldHeight: number
): GameStore["cells"] =>
  [...Array(fieldHeight).keys()].map(() =>
    [...Array(fieldWidth).keys()].map((): Cell => getCell())
  );

export const checkWin = (cells: Readonly<GameStore["cells"]>): boolean => {
  const { fieldWidth, fieldHeight } = getFieldSize(cells);
  if (!fieldWidth || !fieldHeight) return false;

  const allPositions = getAllPositions(fieldWidth, fieldHeight);

  const isOpenedMine = allPositions.some(
    ([x, y]) => cells[y]?.[x]?.isMine && cells[y]?.[x]?.isOpen
  );
  if (isOpenedMine) return false;

  const openAllNoMine = allPositions
    .filter(([x, y]) => !cells[y]?.[x]?.isMine)
    .every(([x, y]) => cells[y]?.[x]?.isOpen);

  const flagAllMine = allPositions
    .filter(([x, y]) => cells[y]?.[x]?.isMine)
    .every(([x, y]) => cells[y]?.[x]?.isFlag);

  return openAllNoMine || flagAllMine;
};

export const getFieldSize = (
  cells: Readonly<GameStore["cells"]>
): { fieldWidth: number; fieldHeight: number } => {
  const fieldWidth = cells[0]?.length || 0;
  const fieldHeight = cells.length;
  return { fieldWidth, fieldHeight };
};

export const getInitialState = (state?: Partial<GameStore>): GameStore => ({
  cells: [],
  cursorPosition: [0, 0],
  difficulty: Difficulty.Easy,
  status: "menu",
  ...state,
});

export const getDiffcultyConfig = (
  diffciulty: Difficulty
): DifficultyConfig => {
  if (diffciulty === Difficulty.Easy) return EASY_DIFFICULTY_CONFIG;
  if (diffciulty === Difficulty.Medium) return MEDIUM_DIFFICULTY_CONFIG;
  if (diffciulty === Difficulty.Hard) return HARD_DIFFICULTY_CONFIG;
  /* c8 ignore next */
  throw RangeError;
};
