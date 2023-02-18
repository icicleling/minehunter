#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui.js";
import store from "./store.js";
import reactRedux from "react-redux/lib/alternate-renderers.js";
const { Provider } = reactRedux;

meow(
  `
	Usage
	  $ minehunter

	Options
		--name  Your name

	Examples
	  $ minehunter --name=Jane
	  Hello, Jane
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
