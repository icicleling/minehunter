import { Box, Text } from "ink";
import React, { useMemo } from "react";
import { useSelector } from "react-redux/es/alternate-renderers.js";
import { RootState } from "../store.js";
import { getAllPositions, getDiffcultyConfig } from "../utils.js";

const HeaderText = () => {
  const status = useSelector((state: RootState) => state.status);
  const cells = useSelector((state: RootState) => state.cells);
  const difficulty = useSelector((state: RootState) => state.difficulty);

  const unflagMineCount = useMemo(() => {
    const { fieldWidthSize, fieldHeightSize, minesCount } =
      getDiffcultyConfig(difficulty);
    const allPosition = getAllPositions(fieldWidthSize, fieldHeightSize);
    const allFlagCount = allPosition.filter(
      ([x, y]) => cells[y]?.[x]?.isFlag
    ).length;
    return minesCount - allFlagCount;
  }, [cells]);

  if (status === "playing")
    return (
      <Text>
        mines: <Text color="blueBright">{unflagMineCount}</Text>
      </Text>
    );

  if (status === "win") return <Text color="green">Your Win!</Text>;

  if (status === "fail") return <Text>Game Over</Text>;

  return <Text>New Game</Text>;
};

const Header = () => {
  const cells = useSelector((state: RootState) => state.cells);
  const borderSize = 2;
  const widthSize = (cells?.[0]?.length || 0) + borderSize;

  return (
    <Box justifyContent="center" width={widthSize}>
      <HeaderText />
    </Box>
  );
};

export default Header;
