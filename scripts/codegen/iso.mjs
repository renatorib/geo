import "zx/globals";
$.verbose = false;

import fs from "node:fs";

import parser from "node-html-parser";
import prettier from "prettier";

import data from "../../src/data-sources/countries/data.json" assert { type: "json" };

const iso = parser.default(fs.readFileSync("src/data-sources/countries/iso3166.html"));

const trs = iso.childNodes[0].childNodes[1].childNodes.filter(
  (n) => n.rawTagName === "tr" && n.childNodes.length === 16,
);

const removeAnnotations = (name) => name.replace(/\[[^\]]*\]/g, "");
const fullTrim = (name) =>
  name
    .trim()
    .split(" ")
    .map((s) => s.trim())
    .join(" ");

const sanitizeName = (name) => fullTrim(removeAnnotations(name).replace(/\([^\)]*\)/g, ""));
const sanitizeOfficialName = (name) => fullTrim(removeAnnotations(name));
const sanitizeCodes = (name) => fullTrim(removeAnnotations(name));

for (const tr of trs) {
  const tds = tr.childNodes.filter((n) => n.rawTagName === "td");
  const [td_name, td_officialName, td_sovereignty, td_alpha2, td_alpha3, td_numericCode, td_subdCode, td_domain] = tds;

  const name = sanitizeName(td_name.textContent);
  const officialName = sanitizeOfficialName(td_officialName.textContent);
  const sovereignty = [sanitizeCodes(td_sovereignty.textContent)]
    .map((v) => (v === "UN observer state" || v === "UN member state" || v === "Disputed" ? null : v))
    .map((v) => {
      switch (v) {
        case "France":
          return "FR";
        case "United States":
          return "US";
        case "United Kingdom":
        case "British Crown":
          return "GB";
        case "Norway":
          return "NO";
        case "Denmark":
          return "DK";
        case "New Zealand":
          return "NZ";
        case "Australia":
          return "AU";
        case "China":
          return "CN";
        case "Netherlands":
          return "NL";
        case "Finland":
          return "FI";
        case "Antarctic Treaty":
          return null;
        default:
          return v;
      }
    })[0];
  const alpha2 = sanitizeCodes(td_alpha2.querySelector("span").textContent);
  const alpha3 = sanitizeCodes(td_alpha3.textContent);
  const numericCode = sanitizeCodes(td_numericCode.textContent);
  const domain = sanitizeCodes(td_domain.textContent);

  const index = data.findIndex((c) => c.id === alpha2);

  if (index !== -1) {
    const snapshot = data[index];
    if (!snapshot.alpha3) {
      data[index].alpha3 = alpha3;
    }
    if (!snapshot.numericCode) {
      data[index].numericCode = numericCode;
    }
    if (!snapshot.independent) {
      data[index].independent = sovereignty ? false : true;
    }
    if (!snapshot.sovereignty) {
      data[index].sovereignty = sovereignty;
    }
    if (!snapshot.domain) {
      data[index].domain = domain;
    }
  }
}

const json = prettier.format(JSON.stringify(data), { parser: "json" });
fs.writeFileSync("src/data-sources/countries/data-tmp.json", json);
