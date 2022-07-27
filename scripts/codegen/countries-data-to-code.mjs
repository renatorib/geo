import "zx/globals";
$.verbose = false;

import vm from "node:vm";
import prettier from "prettier";
import data from "../../src/countries/data.json" assert { type: "json" };

const stg = JSON.stringify;

const template = `
import * as flags from "./flags";
import * as enums from "./enums";

export const countries = [${data
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
  .join(", ")}];

export type Country = typeof countries[number];
`;

const json = prettier.format(template, { parser: "typescript" });

await $`echo ${json} > src/countries/index-tmp.ts`;
