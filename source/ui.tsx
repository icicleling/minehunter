import React, { FC } from "react";
import { Text } from "ink";

const App: FC<{ name?: string }> = ({ name = "Stranger" }) => (
  <Text>
    Hello, <Text color="green">{name}</Text>
  </Text>
);

export default App;
