import { Box, Text, useInput } from "ink";
import React, { useState } from "react";
import { useDispatch } from "react-redux/es/exports.js";
import { Difficulty } from "../constants.js";
import { actions } from "../store.js";

const MenuList = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];
const Menu = () => {
  const [select, setSelect] = useState<number>(0);
  const dispatch = useDispatch();

  useInput((input, { upArrow, downArrow }) => {
    upArrow && setSelect(select ? select - 1 : MenuList.length - 1);
    downArrow && setSelect(select === MenuList.length - 1 ? 0 : select + 1);

    const difficulty = MenuList[select];
    input === " " && difficulty && dispatch(actions.setDifficulty(difficulty));
  });

  return (
    <Box flexDirection="column" borderStyle="single" width={15}>
      {MenuList.map((item, index) => (
        <Text key={item} color={select === index ? "green" : "white"}>
          <Text>{select === index ? ">" : " "}</Text> {item}
        </Text>
      ))}
    </Box>
  );
};

export default Menu;
