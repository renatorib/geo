import "zx/globals";
$.verbose = false;

import prettier from "prettier";
import chalk from "chalk";

const ls = await $`ls src/countries/flags`;

const files = ls.stdout
  .split("\n")
  .filter(Boolean)
  .filter((c) => c.endsWith(".png"))
  .map((c) => c.slice(0, -".png".length));

const template = prettier.format(
  `
    // THIS FILE IS AUTO GENERATED
    // DO NOT EDIT MANUALLY

    // GENERATED BY scripts/codegen/flags-index.mjs
    // TO REGEN RUN \`yarn zx scripts/codegen/flags-index.mjs\`

    ${files.map((file) => `import ${file} from "./${file}.png";`).join("\n")}

    export { ${files.join(", ")} }
  `,
  {
    parser: "typescript",
  }
);

await $`touch src/countries/flags/index.ts`;
await $`echo ${template} > src/countries/flags/index.ts`;
console.log(chalk.green(`${chalk.bold("Generated:")} src/countries/flags/index.ts`));
