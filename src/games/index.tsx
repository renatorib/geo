import { upperFirstLetter } from "~/modules/string";
import { countries, Country } from "../data-sources/countries";
import * as countriesDisplay from "../data-sources/countries/display";
import { footballClubs, FootballClub } from "~/data-sources/football-clubs";
import { DisplayLogo } from "~/data-sources/football-clubs/display/DisplayLogo";
import { Region } from "../data-sources/countries/enums";
import { RiCommunityFill, RiFlag2Fill, RiMap2Fill, RiWindow2Fill } from "react-icons/ri";
import { GiBrazil, GiSoccerBall } from "react-icons/gi";
import { Property } from "~/hooks/useLang";

type Query<T> = (data: T) => boolean;
type Guess<T> = (data: T, p: Property) => { value: string; aliases: string[] };

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
  guess: Guess<T>;
} & (
  | {
      type: "cards";
      display: (props: { data: T; checked: "correct" | "spoiler" | false }) => JSX.Element;
    }
  | {
      type: "world-map";
    }
);

const country = {
  guess: {
    name: (c: Country, p: Property) => ({ value: c.name[p], aliases: c.alias[p] }),
    capital: (c: Country, p: Property) => ({ value: c.capital[p], aliases: c.capitalAlias[p] }),
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

export type Entity = {
  id: string;
};

const game = <T extends Entity>(options: Game<T>) => ({
  ...options,
});

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
    guess: country.guess.name,
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
    guess: country.guess.name,
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
    guess: country.guess.name,
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
    name: "Capitals 1",
    description: "Guess countries by their capitals",
    url: "capitals",
    icon: <RiCommunityFill />,
    type: "cards",
    data: countries,
    query: country.have.capital,
    display: countriesDisplay.CapitalsDisplay,
    guess: country.guess.name,
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
    name: "Capitals 2",
    description: "Guess capitals by country names",
    url: "capitals-2",
    icon: <RiCommunityFill />,
    type: "cards",
    data: countries,
    query: country.have.capital,
    display: countriesDisplay.NamesDisplay,
    guess: country.guess.capital,
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
    guess: country.guess.name,
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
    guess: ({ name }) => ({ value: name, aliases: [] }),
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
    guess: game.guess,
    data: queriedData,
    title: `${upperFirstLetter(game.name)} (${upperFirstLetter(group.url)})`,
    display: "display" in game ? game.display : undefined,
  };
};
