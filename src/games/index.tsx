import * as display from "./display";
import { upperFirstLetter } from "~/modules/string";
import { countries, Country } from "../countries";
import { Region } from "../countries/enums";
import { RiCommunityFill, RiFlag2Fill, RiMap2Fill, RiWindow2Fill } from "react-icons/ri";
import { GiBrazil } from "react-icons/gi";

type Query = (c: Country) => boolean;

type Group = {
  url: string;
  query: Query;
};

type Game = {
  name: string;
  icon: React.ReactNode;
  description: string;
  url: string;
  query: Query;
  groups: Group[];
} & (
  | {
      type: "countries-cards-quiz";
      display: typeof display.FlagsDisplay;
    }
  | {
      type: "capitals-cards-quiz";
      display: typeof display.FlagsDisplay;
    }
  | {
      type: "world-map";
    }
);

const select = {
  all: (c: Country) => true,
  independent: (c: Country) => c.independent === true,
};

const from = {
  africa: (c: Country) => c.region === Region.Africa,
  america: (c: Country) => c.region === Region.America,
  asia: (c: Country) => c.region === Region.Asia,
  europe: (c: Country) => c.region === Region.Europe,
  oceania: (c: Country) => c.region === Region.Oceania,
  noRegion: (c: Country) => c.region === null,
};

const have = {
  flag: (c: Country) => c.flag != null,
  shape: (c: Country) => c.shape != null,
  domain: (c: Country) => c.domain != null && c.domain != "",
  capital: (c: Country) => c.capital != null && c.capital.en != "",
};

const group = (url: Group["url"], query: Group["query"]): Group => ({
  url,
  query,
});

export const games: Game[] = [
  {
    name: "Flags",
    description: "Guess countries by their flags",
    url: "flags",
    icon: <RiFlag2Fill />,
    type: "countries-cards-quiz",
    query: have.flag,
    display: display.FlagsDisplay,
    groups: [
      group("world", select.independent),
      group("africa", from.africa),
      group("america", from.america),
      group("asia", from.asia),
      group("europe", from.europe),
      group("oceania", from.oceania),
      group("others", from.noRegion),
    ],
  },
  {
    name: "Map",
    description: "Guess countries in the map",
    url: "map",
    icon: <RiMap2Fill />,
    type: "world-map",
    query: select.all,
    groups: [
      group("world", select.all),
      group("africa", from.africa),
      group("america", from.america),
      group("asia", from.asia),
      group("europe", from.europe),
      group("oceania", from.oceania),
    ],
  },
  {
    name: "Shapes",
    description: "Guess countries by their shapes",
    url: "shapes",
    icon: <GiBrazil />,
    type: "countries-cards-quiz",
    query: have.shape,
    display: display.ShapesDisplay,
    groups: [
      group("world", select.independent),
      group("africa", from.africa),
      group("america", from.america),
      group("asia", from.asia),
      group("europe", from.europe),
      group("oceania", from.oceania),
      group("others", from.noRegion),
    ],
  },
  {
    name: "Capitals 1",
    description: "Guess countries by their capitals",
    url: "capitals",
    icon: <RiCommunityFill />,
    type: "countries-cards-quiz",
    query: have.capital,
    display: display.CapitalsDisplay,
    groups: [
      group("world", select.independent),
      group("africa", from.africa),
      group("america", from.america),
      group("asia", from.asia),
      group("europe", from.europe),
      group("oceania", from.oceania),
      group("others", from.noRegion),
    ],
  },
  {
    name: "Capitals 2",
    description: "Guess capitals by country names",
    url: "capitals-2",
    icon: <RiCommunityFill />,
    type: "capitals-cards-quiz",
    query: have.capital,
    display: display.NamesDisplay,
    groups: [
      group("world", select.independent),
      group("africa", from.africa),
      group("america", from.america),
      group("asia", from.asia),
      group("europe", from.europe),
      group("oceania", from.oceania),
      group("others", from.noRegion),
    ],
  },
  {
    name: "Domains",
    description: "Guess countries by their domains",
    url: "domains",
    icon: <RiWindow2Fill />,
    type: "countries-cards-quiz",
    query: have.domain,
    display: display.DomainsDisplay,
    groups: [
      group("world", select.independent),
      group("africa", from.africa),
      group("america", from.america),
      group("asia", from.asia),
      group("europe", from.europe),
      group("oceania", from.oceania),
      group("others", from.noRegion),
    ],
  },
];

export const findGameByUrl = (url: string /* ex.: flags/america */) => {
  const [gameUrl, groupUrl] = url.split("/");

  const game = games.find((g) => g.url === gameUrl);

  if (!game) {
    return false;
  }

  const group = game.groups.find((g) => g.url === groupUrl);

  if (!group) {
    return false;
  }

  const countriesToPlay = countries.filter(game.query).filter(group.query);

  return {
    name: game.name,
    description: game.description,
    type: game.type,
    countries: countriesToPlay,
    title: `${upperFirstLetter(game.name)}${group.url !== "world" ? ` (${upperFirstLetter(group.url)})` : ""}`,
    display: "display" in game ? game.display : undefined,
  };
};
