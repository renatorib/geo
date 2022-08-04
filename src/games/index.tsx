import * as display from "./display";
import { upperFirstLetter } from "~/modules/string";
import { countries, Country } from "../countries";
import { Region } from "../countries/enums";

const select = {
  all: (c: Country) => c,
};

const from = {
  africa: (c: Country) => c.region === Region.Africa,
  america: (c: Country) => c.region === Region.America,
  asia: (c: Country) => c.region === Region.Asia,
  europe: (c: Country) => c.region === Region.Europe,
  oceania: (c: Country) => c.region === Region.Oceania,
  others: (c: Country) => c.region === null,
  world: (c: Country) => c.region != null,
};

const have = {
  flag: (c: Country) => c.flag != null,
  shape: (c: Country) => c.shape != null,
  domain: (c: Country) => c.domain != null && c.domain != "",
  capital: (c: Country) => c.capital != null && c.capital.en != "",
};

export const games = [
  {
    name: "flags",
    type: "cards-quiz",
    query: have.flag,
    display: display.FlagsDisplay,
    groups: [
      {
        name: "world",
        query: from.world,
      },
      {
        name: "africa",
        query: from.africa,
      },
      {
        name: "america",
        query: from.america,
      },
      {
        name: "asia",
        query: from.asia,
      },
      {
        name: "europe",
        query: from.europe,
      },
      {
        name: "oceania",
        query: from.oceania,
      },
      {
        name: "others",
        query: from.others,
      },
    ],
  },
  {
    name: "map",
    type: "world-map",
    query: select.all,
    groups: [
      {
        name: "world",
        query: select.all,
      },
      {
        name: "africa",
        query: from.africa,
      },
      {
        name: "america",
        query: from.america,
      },
      {
        name: "asia",
        query: from.asia,
      },
      {
        name: "europe",
        query: from.europe,
      },
      {
        name: "oceania",
        query: from.oceania,
      },
    ],
  },
  {
    name: "shapes",
    type: "cards-quiz",
    query: have.shape,
    display: display.ShapesDisplay,
    groups: [
      {
        name: "world",
        query: from.world,
      },
      {
        name: "africa",
        query: from.africa,
      },
      {
        name: "america",
        query: from.america,
      },
      {
        name: "asia",
        query: from.asia,
      },
      {
        name: "europe",
        query: from.europe,
      },
      {
        name: "oceania",
        query: from.oceania,
      },
      {
        name: "others",
        query: from.others,
      },
    ],
  },
  {
    name: "capitals",
    type: "cards-quiz",
    query: have.capital,
    display: display.CapitalsDisplay,
    groups: [
      {
        name: "world",
        query: from.world,
      },
      {
        name: "africa",
        query: from.africa,
      },
      {
        name: "america",
        query: from.america,
      },
      {
        name: "asia",
        query: from.asia,
      },
      {
        name: "europe",
        query: from.europe,
      },
      {
        name: "oceania",
        query: from.oceania,
      },
      {
        name: "others",
        query: from.others,
      },
    ],
  },
  {
    name: "domains",
    type: "cards-quiz",
    query: have.domain,
    display: display.DomainsDisplay,
    groups: [
      {
        name: "world",
        query: from.world,
      },
      {
        name: "africa",
        query: from.africa,
      },
      {
        name: "america",
        query: from.america,
      },
      {
        name: "asia",
        query: from.asia,
      },
      {
        name: "europe",
        query: from.europe,
      },
      {
        name: "oceania",
        query: from.oceania,
      },
      {
        name: "others",
        query: from.others,
      },
    ],
  },
];

export const findGameByUrl = (url: string /* ex.: flags/america */) => {
  const [name, groupName] = url.split("/");

  const game = games.find((g) => g.name === name);

  if (!game) {
    return false;
  }

  const group = game.groups.find((g) => g.name === groupName);

  if (!group) {
    return false;
  }

  const countriesToPlay = countries.filter(game.query).filter(group.query);

  return {
    name: game.name,
    type: game.type,
    countries: countriesToPlay,
    title: `${upperFirstLetter(game.name)} (${upperFirstLetter(group.name)})`,
    display: game.display,
  };
};
