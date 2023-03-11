#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui.js";
import store from "./store.js";
import { Provider } from "react-redux/es/alternate-renderers.js";

meow(
  `
	Usage
	  $ minehunter

  Game Operation
    [↑/↓/←/→]  Move
    [space]    Open cell
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
