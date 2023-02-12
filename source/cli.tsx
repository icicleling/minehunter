#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui.js";

const cli = meow(
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

render(<App name={cli.flags.name} />);
