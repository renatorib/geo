import "zx/globals";
$.verbose = false;

import fs from "node:fs";
import prettier from "prettier";
import data from "../../src/countries/data.json" assert { type: "json" };

const ls = await $`ls src/countries/svgs`;

const svgs = ls.stdout
  .split("\n")
  .filter(Boolean)
  .filter((c) => c.endsWith(".svg"))
  .map((c) => c.slice(0, -".svg".length));

for (const svg of svgs) {
  const content = await $`cat src/countries/svgs/${svg}.svg`;
  const shape = content.stdout.match(/path d=\"([^"]*)\"/)?.[1];
  if (shape) {
    const index = data.findIndex((c) => c.id === svg);
    if (data[index]) {
      data[index].shape = shape;
    }
  }
}

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/countries/data-tmp.json", json);
