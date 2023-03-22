#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./App.js";
import store from "./store.js";
import { Provider } from "react-redux/es/alternate-renderers.js";

meow(
  `
	Usage
	  $ minehunter

  Game Operation
    [↑/↓/←/→]  Move
    [space]    Open cell / Confirm
    [f]        Flag
    [r]        Restart
    [q]        Quit
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: "string",
      },
    },
  }
);

render(
  <Provider store={store}>
    <App />
  </Provider>
);
