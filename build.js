import esbuild from "esbuild";
import fs from "node:fs";

const fixNbindJS = {
  name: "fixNbindJS",
  setup(build) {
    build.onLoad({ filter: /.nbind.js$/ }, async (args) => {
      let text = await fs.promises.readFile(args.path, "utf8");
      return {
        contents: text.replace(
          "_a = _typeModule(_typeModule),",
          "var _a = _typeModule(_typeModule);"
        ),
        loader: "js",
      };
    });
  },
};

await esbuild.build({
  entryPoints: ["./source/cli.tsx"],
  outfile: "dist/cli.js",
  bundle: true,
  platform: "node",
  format: "esm",
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  },
  plugins: [fixNbindJS],
  minify: true,
});
