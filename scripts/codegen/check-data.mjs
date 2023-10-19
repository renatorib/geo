import "zx/globals";
$.verbose = false;

import fs from "node:fs";

// import parser from "node-html-parser";
import prettier from "prettier";

import data from "../../src/data-sources/countries/data.json" assert { type: "json" };

const normalizeIdToFile = (id) => id.toUpperCase().replace(/-/g, "");

let count = 0;
for (const [index] of Object.entries(data)) {
  const country = data[index];
  const flagExist = fs.existsSync(`src/data-sources/countries/flags/${normalizeIdToFile(country.id)}.png`);

  if (!flagExist) {
    console.log(country.id, country.sovereignty ? `(${country.sovereignty})` : "", country.name.en);
    count++;
  }
}

console.log("Total", count);

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/data-sources/countries/data-tmp.json", json);
