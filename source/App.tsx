import React from "react";
import { Box, useApp, useInput } from "ink";
import Grid from "./components/Field.js";
import Header from "./components/Header.js";
import { useSelector } from "react-redux/es/exports.js";
import { RootState } from "./store.js";
import Menu from "./components/Menu.js";

const App = () => {
  const { exit } = useApp();
  const status = useSelector((state: RootState) => state.status);

  useInput((input) => {
    if (input === "q") exit();
  });

  if (status === "menu") return <Menu />;

  return (
    <Box flexDirection="column">
      <Header />
      <Grid />
    </Box>
  );
};

export default App;
