import React from "react";
import { Box, useApp, useInput } from "ink";
import Grid from "./components/Field.js";

const App = () => {
  const { exit } = useApp();

  useInput((input) => {
    if (input === "q") exit();
  });

  return (
    <Box>
      <Grid />
    </Box>
  );
};

export default App;
