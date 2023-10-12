import { upperFirstLetter } from "~/lib/string";
import { countries, Country } from "../data-sources/countries";
import * as countriesDisplay from "../data-sources/countries/display";
import { footballClubs, FootballClub } from "~/data-sources/football-clubs";
import { DisplayLogo } from "~/data-sources/football-clubs/display/DisplayLogo";
import { Region } from "../data-sources/countries/enums";
import { RiCommunityFill, RiCommunityLine, RiFlag2Fill, RiFlagFill, RiMap2Fill, RiWindow2Fill } from "react-icons/ri";
import { GiBrazil, GiSoccerBall } from "react-icons/gi";
import { Property } from "~/features/i18n";
import { Display } from "~/data-sources";

export type Entity = { id: string };
export type Answer<T> = (data: T, langProp: Property) => { value: string; aliases: string[] };

type Query<T> = (data: T) => boolean;

type Group<T> = {
  url: string;
  query: Query<T>;
};

type Game<T> = {
  name: string;
  icon: React.ReactNode;
  description: string;
  url: string;
  data: T[];
  query: Query<T>;
  groups: Group<T>[];
  answer: Answer<T>;
} & (
  | {
      type: "zen";
      display: Display<T>;
    }
  | {
      type: "cards";
      display: Display<T>;
    }
  | {
      type: "world-map";
    }
);

const country = {
  answer: {
    name: (c: Country, p: Property) => ({ value: c.name[p], aliases: [...c.alias[p], c.name["en"], ...c.alias["en"]] }),
    capital: (c: Country, p: Property) => ({
      value: c.capital[p],
      aliases: [...c.capitalAlias[p], c.capital["en"], ...c.capitalAlias["en"]],
    }),
  },
  select: {
    all: (c: Country) => true,
    independent: (c: Country) => c.independent === true,
  },
  from: {
    africa: (c: Country) => c.region === Region.Africa,
    america: (c: Country) => c.region === Region.America,
    asia: (c: Country) => c.region === Region.Asia,
    europe: (c: Country) => c.region === Region.Europe,
    oceania: (c: Country) => c.region === Region.Oceania,
    noRegion: (c: Country) => c.region === null,
  },
  have: {
    flag: (c: Country) => c.flag != null,
    shape: (c: Country) => c.shape != null,
    domain: (c: Country) => c.domain != null && c.domain != "",
    capital: (c: Country) => c.capital != null && c.capital.en != "",
  },
};

const game = <T extends Entity>(options: Game<T>) => ({
  ...options,
});

// TODO: use satisfies
export const games: Game<any>[] = [
  game<Country>({
    name: "Flags",
    description: "Guess countries by their flags",
    url: "flags",
    icon: <RiFlag2Fill />,
    type: "cards",
    data: countries,
    query: country.have.flag,
    display: countriesDisplay.FlagsDisplay,
    answer: country.answer.name,
    groups: [
      { url: "world", query: country.select.independent },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
      { url: "others", query: country.from.noRegion },
    ],
  }),

  game<Country>({
    name: "Flags Zen",
    description: "Guess countries by their flags",
    url: "flags-zen",
    icon: <RiFlagFill />,
    type: "zen",
    data: countries,
    query: country.have.flag,
    display: countriesDisplay.FlagsDisplay,
    answer: country.answer.name,
    groups: [
      { url: "world", query: country.select.independent },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
      { url: "others", query: country.from.noRegion },
    ],
  }),

  game<Country>({
    name: "Map",
    description: "Guess countries in the map",
    url: "map",
    icon: <RiMap2Fill />,
    type: "world-map",
    data: countries,
    query: country.select.all,
    answer: country.answer.name,
    groups: [
      { url: "world", query: country.select.all },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
    ],
  }),

  game<Country>({
    name: "Shapes",
    description: "Guess countries by their shapes",
    url: "shapes",
    icon: <GiBrazil />,
    type: "cards",
    data: countries,
    query: country.have.shape,
    display: countriesDisplay.ShapesDisplay,
    answer: country.answer.name,
    groups: [
      { url: "world", query: country.select.independent },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
      { url: "others", query: country.from.noRegion },
    ],
  }),

  game<Country>({
    name: "Capitals",
    description: "Guess countries by their capitals",
    url: "capitals",
    icon: <RiCommunityFill />,
    type: "cards",
    data: countries,
    query: country.have.capital,
    display: countriesDisplay.CapitalsDisplay,
    answer: country.answer.name,
    groups: [
      { url: "world", query: country.select.independent },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
      { url: "others", query: country.from.noRegion },
    ],
  }),

  game<Country>({
    name: "Capitals Reversed",
    description: "Guess capitals by country names",
    url: "capitals-2",
    icon: <RiCommunityLine />,
    type: "cards",
    data: countries,
    query: country.have.capital,
    display: countriesDisplay.NamesDisplay,
    answer: country.answer.capital,
    groups: [
      { url: "world", query: country.select.independent },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
      { url: "others", query: country.from.noRegion },
    ],
  }),

  game<Country>({
    name: "Domains",
    description: "Guess countries by their domains",
    url: "domains",
    icon: <RiWindow2Fill />,
    type: "cards",
    data: countries,
    query: country.have.domain,
    display: countriesDisplay.DomainsDisplay,
    answer: country.answer.name,
    groups: [
      { url: "world", query: country.select.independent },
      { url: "africa", query: country.from.africa },
      { url: "america", query: country.from.america },
      { url: "asia", query: country.from.asia },
      { url: "europe", query: country.from.europe },
      { url: "oceania", query: country.from.oceania },
      { url: "others", query: country.from.noRegion },
    ],
  }),

  /* game<FootballClub>({
    name: "Football Clubs Logos",
    description: "Guess football clubs by their logos",
    url: "football-clubs-logos",
    icon: <GiSoccerBall />,
    type: "cards",
    data: footballClubs,
    query: () => true,
    display: DisplayLogo,
    answer: ({ name }) => ({ value: name, aliases: [] }),
    groups: [{ url: "all", query: () => true }],
  }), */
];

export const findGameByUrl = (url: string /* <game_url>/<group_url> - ex.: flags/america */) => {
  const [gameUrl, groupUrl] = url.split("/");

  const game = games.find((g) => g.url === gameUrl);

  if (!game) {
    return false;
  }

  const group = game.groups.find((g) => g.url === groupUrl);

  if (!group) {
    return false;
  }

  const queriedData = game.data.filter(game.query).filter(group.query);

  return {
    name: game.name,
    description: game.description,
    type: game.type,
    answer: game.answer,
    data: queriedData,
    title: `${upperFirstLetter(game.name)} (${upperFirstLetter(group.url)})`,
    display: "display" in game ? game.display : undefined,
  };
};
