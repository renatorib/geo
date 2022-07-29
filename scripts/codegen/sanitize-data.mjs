import "zx/globals";
$.verbose = false;

import fs from "node:fs";
import prettier from "prettier";
import parser from "node-html-parser";
import data from "../../src/countries/data.json" assert { type: "json" };

const normalizeIdToFile = (id) => id.toUpperCase().replace(/-/g, "");

for (const [index, country] of Object.entries(data)) {
  const country = data[index];

  if ("continent" in country) {
    const c = country.continent;
    delete data[index].continent;
    data[index].region = c;
  }
}

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/countries/data-tmp.json", json);
