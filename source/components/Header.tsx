import { Text } from "ink";
import React, { useMemo } from "react";
import reactRedux from "react-redux/lib/alternate-renderers.js";
import {
  FIELD_HEIGHT_SIZE,
  FIELD_WIDTH_SIZE,
  MINES_COUNT,
  RootState,
} from "../store.js";
import { getAllPositions } from "../utils.js";
const { useSelector } = reactRedux;

const Header = () => {
  const status = useSelector((state: RootState) => state.status);
  const cells = useSelector((state: RootState) => state.cells);

  const unflagMineCount = useMemo(() => {
    const allPosition = getAllPositions(FIELD_WIDTH_SIZE, FIELD_HEIGHT_SIZE);
    const allFlagCount = allPosition.filter(
      ([x, y]) => cells[y]?.[x]?.isFlag
    ).length;
    return MINES_COUNT - allFlagCount;
  }, [cells]);

  if (status === "playing")
    return (
      <Text>
        mines: <Text color="blue">{unflagMineCount}</Text>
      </Text>
    );

  if (status === "win") return <Text color="green">Your Win!</Text>;

  if (status === "fail") return <Text>Game Over</Text>;

  return <Text>New Game</Text>;
};

export default Header;
