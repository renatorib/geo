import "zx/globals";
$.verbose = false;

import data from "../../src/countries/data.json" assert { type: "json" };

const missing = data.filter((c) => c.capital == null);

console.log("Missing total:", missing.length);
for (const m of missing) {
  console.log(m.name.pt);
}
