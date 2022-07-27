import "zx/globals";
$.verbose = false;

import fs from "node:fs";
import prettier from "prettier";
import chalk from "chalk";
import data from "../../src/countries/data.json" assert { type: "json" };

const stg = JSON.stringify;

const template = `
// THIS FILE IS AUTO GENERATED
// DO NOT EDIT MANUALLY

import * as flags from "./flags";
import * as enums from "./enums";

export const countries = [
  ${data
    .map(
      (country) => `{
        id: ${stg(country.id)},
        name: ${stg(country.name)}, 
        alias: ${stg(country.alias)}, 
        shape: ${stg(country.shape)}, 
        alpha2: ${stg(country.alpha2)},
        alpha3: ${stg(country.alpha3)},
        flag: flags.${country.id}, 
        continent: enums.Continent.${country.continent},
      }`
    )
    .join(", ")}
];

export type Country = typeof countries[number];
`;

const code = prettier.format(template, { parser: "typescript" });
fs.writeFileSync("src/countries/index.ts", code);
console.log(chalk.green(`${chalk.bold("Generated:")} src/countries/index.ts`));
