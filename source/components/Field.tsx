import { Box, useInput } from "ink";
import React from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux/es/alternate-renderers.js";
import { actions, RootState } from "../store.js";
import FieldCell from "./FieldCell.js";

const Grid = () => {
  const dispatch = useDispatch();
  const cells = useSelector((state: RootState) => state.cells);
  const [x, y] = useSelector((state: RootState) => state.cursorPosition);
  const { up, down, left, right, open, flag, restart } = actions;

  useInput((input, { upArrow, downArrow, leftArrow, rightArrow }) => {
    upArrow && dispatch(up());
    downArrow && dispatch(down());
    leftArrow && dispatch(left());
    rightArrow && dispatch(right());
    input === " " && dispatch(open());
    input === "f" && dispatch(flag());
    input === "r" && dispatch(restart());
  });

  return (
    <Box flexDirection="column" alignSelf="flex-start" borderStyle="single">
      {cells.map((row, ri) => {
        return (
          <Box key={ri}>
            {row.map((cell, ci) => (
              <FieldCell key={ci} cell={cell} focus={x === ci && y === ri} />
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default Grid;
