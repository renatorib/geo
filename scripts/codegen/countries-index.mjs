import "zx/globals";
$.verbose = false;

import fs from "node:fs";
import prettier from "prettier";
import chalk from "chalk";
import data from "../../src/data-sources/countries/data.json" assert { type: "json" };

const stg = JSON.stringify;
const normalizeIdToFile = (id) => id.toUpperCase().replace(/-/g, "");

const template = `
// THIS FILE IS AUTO GENERATED
// DO NOT EDIT MANUALLY

import * as flags from "./flags";
import * as enums from "./enums";

export const countries = [
  ${data
    .map((country) => {
      const flagExist = fs.existsSync(`src/data-sources/countries/flags/${normalizeIdToFile(country.id)}.png`);
      return `{
        id: ${stg(country.id)},
        name: ${stg(country.name)}, 
        alias: ${stg(country.alias)}, 
        shape: ${stg(country.shape)}, 
        alpha2: ${stg(country.alpha2)},
        alpha3: ${stg(country.alpha3)},
        emoji: ${stg(country.emoji)},
        independent: ${stg(country.independent)},
        sovereignty: ${stg(country.sovereignty)},
        domain: ${stg(country.domain)},
        disputed: ${stg(country.disputed ?? false)},
        capital: ${stg(country.capital)},
        capitalAlias: ${stg(country.capitalAlias)},
        flag: ${flagExist ? `flags.${normalizeIdToFile(country.id)}` : `null`}, 
        region: ${country.region ? `enums.Region.${country.region}` : `null`},
      }`;
    })
    .join(", ")}
];

export type Country = typeof countries[number];
`;

const code = prettier.format(template, { parser: "typescript" });
fs.writeFileSync("src/data-sources/countries/index.ts", code);
console.log(chalk.green(`${chalk.bold("Generated:")} src/data-sources/countries/index.ts`));
