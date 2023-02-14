import React, { FC } from "react";
import { Box, Text, useInput } from "ink";
import { gameActions, RootState } from "./store.js";
import {
  useDispatch,
  useSelector,
} from "react-redux/lib/alternate-renderers.js";

const App: FC<{ name?: string }> = ({ name = "Stranger" }) => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.game.value);

  useInput((input) => {
    if (input === "w") {
      return dispatch(gameActions.increment());
    }
    if (input === "s") return dispatch(gameActions.decrement());
    return;
  });

  return (
    <Box>
      <Text>
        Hello, <Text color="green">{name}</Text>
      </Text>
      <Box>
        <Text>number: {value}</Text>
      </Box>
    </Box>
  );
};

export default App;
