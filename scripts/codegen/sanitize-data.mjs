import "zx/globals";
$.verbose = false;

import fs from "node:fs";

import parser from "node-html-parser";
import prettier from "prettier";

import data from "../../src/data-sources/countries/data.json" assert { type: "json" };

const normalizeIdToFile = (id) => id.toUpperCase().replace(/-/g, "");

for (const [index] of Object.entries(data)) {
  const country = data[index];

  if ("continent" in country) {
    const c = country.continent;
    delete data[index].continent;
    data[index].region = c;
  }
}

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/data-sources/countries/data-tmp.json", json);
