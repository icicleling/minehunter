import { Text, TextProps } from "ink";
import React from "react";
import { Cell } from "../interface.js";

interface Props {
  cell: Cell;
  focus: boolean;
}

const MINES_COLOR: { [k: number]: TextProps["color"] } = {
  1: "gray",
  2: "gray",
  3: "yellow",
  4: "yellow",
  5: "magenta",
  6: "magenta",
  7: "magenta",
  8: "magenta",
};

const StyledText = ({
  focus,
  children,
  ...rest
}: Pick<Props, "focus"> & TextProps) => (
  <Text backgroundColor={focus ? "blueBright" : undefined} {...rest}>
    {children}
  </Text>
);

const FieldCell = ({ cell, focus }: Props) => {
  if (cell.isOpen)
    return (
      <>
        {cell.isMine ? (
          <StyledText focus={focus} color="redBright">
            *
          </StyledText>
        ) : (
          <StyledText focus={focus} color={MINES_COLOR[cell.minesAround]}>
            {cell.minesAround || " "}
          </StyledText>
        )}
      </>
    );

  if (cell.isFlag)
    return (
      <StyledText focus={focus} color="green">
        F
      </StyledText>
    );

  return <StyledText focus={focus}>#</StyledText>;
};

export default FieldCell;
