import React from "react";
import { Box, useApp, useInput } from "ink";
import Grid from "./components/Field.js";
import Header from "./components/Header.js";

const App = () => {
  const { exit } = useApp();

  useInput((input) => {
    if (input === "q") exit();
  });

  return (
    <Box flexDirection="column">
      <Header />
      <Grid />
    </Box>
  );
};

export default App;
