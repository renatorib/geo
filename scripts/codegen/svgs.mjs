import "zx/globals";
$.verbose = false;

import fs from "node:fs";

import parser from "node-html-parser";
import prettier from "prettier";

import data from "../../src/data-sources/countries/data.json" assert { type: "json" };

const world = parser.default(fs.readFileSync("src/data-sources/countries/world.svg"));
const paths = world.childNodes[0].childNodes.filter((n) => n.rawTagName === "path");

for (const path of paths) {
  const attr = path.attributes;
  const index = data.findIndex((c) => c.id.toLocaleLowerCase() === attr.id.toLocaleLowerCase());

  if (index >= 0) {
    data[index].independent = true;
    data[index].shape = attr.d;
  } else {
    data.push({
      id: attr.id.toUpperCase(),
      name: { pt: attr.name, en: attr.name },
      alias: { pt: [], en: [] },
      flag: null,
      continent: null,
      alpha2: attr.id.toUpperCase(),
      alpha3: null,
      code: null,
      shape: attr.d,
      independent: false,
    });
  }
}

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/data-sources/countries/data-tmp.json", json);
