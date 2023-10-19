import "zx/globals";
$.verbose = false;

import fs from "node:fs";

import translate from "@vitalets/google-translate-api";
import chalk from "chalk";
import parser from "node-html-parser";
import prettier from "prettier";

import data from "../../src/data-sources/countries/data.json" assert { type: "json" };

const iso = parser.default(fs.readFileSync("src/data-sources/countries/capitals.html"));

const countryFound = (name) => {
  const property = "en";
  const normalize = (input) =>
    input
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/-/gu, " ")
      .toLowerCase()
      .trim();

  for (const country of data) {
    const answers = [country.name[property], ...country.alias[property]].map(normalize);
    const guess = normalize(name);
    if (answers.includes(guess)) {
      return country;
    }
  }

  return false;
};

const removeAnnotations = (name) => name.replace(/\[[^\]]*\]/g, "");
const fullTrim = (name) =>
  name
    .trim()
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .join(" ");

const sanitizeName = (name) => fullTrim(removeAnnotations(name).replace(/\([^\)]*\)/g, ""));
const sanitizeOfficialName = (name) => fullTrim(removeAnnotations(name));
const sanitizeCodes = (name) => fullTrim(removeAnnotations(name));

const trs = iso.childNodes[0].childNodes.filter((n) => n.rawTagName === "tr");
let count = 0;

for (const tr of trs) {
  count++;
  const tds = tr.childNodes.filter((n) => n.rawTagName === "td");
  if (tds.length != 3) {
    console.log(chalk.bgRed(`${count} of ${trs.length}`), "SKIP");
    continue;
  }

  const countryName = sanitizeName(tds[1].textContent);
  const country = countryFound(countryName);
  if (country) {
    const capital = sanitizeName(tds[0].textContent);
    const ptCapital = (await translate(capital, { from: "en", to: "pt" })).text;
    console.log(chalk.bgGreen(`${count} of ${trs.length}`), countryName, chalk.cyan(capital), chalk.green(ptCapital));
    const index = data.findIndex((c) => c.id === country.id);
    if (index !== -1) {
      const snapshot = data[index];
      if (!snapshot.capital) {
        data[index].capital = { pt: ptCapital, en: capital };
      }
      if (!snapshot.capitalAlias) {
        data[index].capitalAlias = { pt: [capital], en: [] };
      }
    }
  }
}

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/data-sources/countries/data-tmp.json", json);
