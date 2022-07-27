import "zx/globals";
$.verbose = false;

import fs from "node:fs";
import prettier from "prettier";
import chalk from "chalk";

const ls = await $`ls src/countries/flags`;

const files = ls.stdout
  .split("\n")
  .filter(Boolean)
  .filter((c) => c.endsWith(".png"))
  .map((c) => c.slice(0, -".png".length));

const template = `
  // THIS FILE IS AUTO GENERATED
  // DO NOT EDIT MANUALLY

  ${files.map((file) => `import ${file} from "./${file}.png";`).join("\n")}

  export { ${files.join(", ")} }
`;

const code = prettier.format(template, { parser: "typescript" });
fs.writeFileSync("src/countries/flags/index.ts", code);
console.log(chalk.green(`${chalk.bold("Generated:")} src/countries/flags/index.ts`));
