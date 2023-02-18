import { Box, Text, useInput } from "ink";
import React from "react";
import reactRedux from "react-redux/lib/alternate-renderers.js";
import { actions, RootState } from "../store.js";

const { useDispatch, useSelector } = reactRedux;

const Grid = () => {
  const dispatch = useDispatch();
  const cells = useSelector((state: RootState) => state.cells);
  const [x, y] = useSelector((state: RootState) => state.cursorPosition);
  const { up, down, left, right, open, flag } = actions;

  useInput((input, { upArrow, downArrow, leftArrow, rightArrow }) => {
    upArrow && dispatch(up());
    downArrow && dispatch(down());
    leftArrow && dispatch(left());
    rightArrow && dispatch(right());
    input === " " && dispatch(open());
    input === "f" && dispatch(flag());
  });

  return (
    <Box flexDirection="column" borderStyle="single">
      {cells.map((row, ri) => {
        return (
          <Box key={ri}>
            {row.map((cell, ci) => (
              <Text
                key={ci}
                backgroundColor={x === ci && y === ri ? "blue" : undefined}
              >
                {cell.isOpen
                  ? cell.isMine
                    ? "*"
                    : cell.minesAround || " "
                  : cell.isFlag
                  ? "F"
                  : "#"}
              </Text>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default Grid;
