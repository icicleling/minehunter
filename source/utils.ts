import randomInteger from "random-int";
import { GameStore, Position } from "./interface.js";

const getAllPositions = (
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
  minesCount: number
) => {
  const minePostions: Position[] = [];

  const allPositions = getAllPositions(fieldWidth, fieldHeight);

  for (let i = 0; i < minesCount; i++) {
    const index = randomInteger(0, allPositions.length - 1);
    minePostions.push(allPositions[index]!);
    allPositions.splice(index, 1);
  }
  return minePostions;
};

const getAroundPositions = (
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
  fieldWidth: number,
  fieldHeight: number,
  [x, y]: Position,
  cells: Readonly<GameStore["cells"]>
) => {
  const aroundPositions = getAroundPositions(fieldWidth, fieldHeight, [x, y]);

  return aroundPositions.reduce((prev, [x, y]) => {
    if (cells[y]![x]!.isMine) return prev + 1;
    return prev;
  }, 0);
};
