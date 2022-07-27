import "zx/globals";
$.verbose = false;

import vm from "node:vm";
import prettier from "prettier";
import data from "../../src/countries/data.json" assert { type: "json" };

const shapes = await $`curl https://raw.githubusercontent.com/sirLisko/world-map-country-shapes/master/index.js`;

const ctx = vm.createContext({});
vm.runInContext(shapes.stdout.replace("export default", "globalThis.shapes ="), ctx);

for (const country of data) {
  const vector = $`curl https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${country.id.toLowerCase()}/vector.svg`;
}

const dataWithShape = data.map((c) => {
  const copy = { ...c };
  const shape = ctx.shapes.find(({ id }) => id === c.id);
  if (shape) {
    copy.shape = shape.shape;
  }
  return copy;
});

const json = prettier.format(JSON.stringify(dataWithShape), { parser: "json", printWidth: 120 });

await $`echo ${json} > src/countries/data-tmp.json`;
