import "zx/globals";
$.verbose = false;

import fs from "node:fs";
import prettier from "prettier";
import parser from "node-html-parser";
import data from "../../src/countries/data.json" assert { type: "json" };

const normalizeIdToFile = (id) => id.toUpperCase().replace(/-/g, "");

let count = 0;
for (const [index, country] of Object.entries(data)) {
  const country = data[index];
  const flagExist = fs.existsSync(`src/countries/flags/${normalizeIdToFile(country.id)}.png`);

  if (!flagExist) {
    console.log(country.id, country.sovereignty ? `(${country.sovereignty})` : "", country.name.en);
    count++;
  }
}

console.log("Total", count);

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/countries/data-tmp.json", json);
