import "zx/globals";
import prettier from "prettier";
import chalk from "chalk";

$.verbose = false;

const folders = ["oceania"];

for (const folder of folders) {
  const ls = await $`ls src/countries/${folder}`;

  const files = ls.stdout
    .split("\n")
    .filter(Boolean)
    .filter((c) => c.endsWith(".png"))
    .map((c) => c.slice(0, -".png".length));

  const template = prettier.format(
    `
    const ${folder} = [${files
      .map(
        (file) =>
          `{ \nid: id(), name: "${
            file.charAt(0).toUpperCase() + file.slice(1)
          }", flag: ${folder}Img.${file} }`
      )
      .join(", ")}]
  `,
    {
      parser: "typescript",
    }
  );

  console.log(template);
}
