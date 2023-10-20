import React from "react";

import { GiBrazil } from "react-icons/gi";
import { RiCommunityFill, RiCommunityLine, RiFlag2Fill, RiFlagFill, RiMap2Fill, RiWindow2Fill } from "react-icons/ri";

import { Display } from "~/data-sources";
import { LanguageProperty } from "~/features/settings";
import { upperFirstLetter } from "~/lib/string";

import { countries, Country } from "../data-sources/countries";
import * as countriesDisplay from "../data-sources/countries/display";
import { Region } from "../data-sources/countries/enums";

export type Entity = { id: string };
export type Answer<T> = (data: T, langProp: LanguageProperty) => { value: string; aliases: string[] };
export type Filter<T> = (data: T) => boolean;
export type Selector<T> = ((data: T) => boolean) | { [k: string]: Selector<T> };
export type Group<T> = { id: string; filter: Filter<T> };
export type DataSourceHelper<T> = { answer: { [k: string]: Answer<T> }; selectors: { [k: string]: Selector<T> } };

export type GameTypesProps<T> =
  | {
      type: "cards-1x1";
      display: Display<T>;
    }
  | {
      type: "cards";
      display: Display<T>;
    }
  | {
      type: "world-map";
    };

export type GameType = GameTypesProps<any>["type"];

export type Game<T> = GameTypesProps<T> & {
  name: string;
  id: string;
  icon: React.ReactNode;
  description: string;
  data: T[];
  filter: Filter<T>;
  groups: Group<T>[];
  answer: Answer<T>;
};

const country = {
  answer: {
    name: (c, p) => ({
      value: c.name[p],
      aliases: [...c.alias[p], c.name["en"], ...c.alias["en"]],
    }),
    capital: (c, p) => ({
      value: c.capital[p],
      aliases: [...c.capitalAlias[p], c.capital["en"], ...c.capitalAlias["en"]],
    }),
  },
  selectors: {
    all: () => true,
    independent: (c) => c.independent === true,
    fromAfrica: (c) => c.region === Region.Africa,
    fromAmerica: (c) => c.region === Region.America,
    fromAsia: (c) => c.region === Region.Asia,
    fromEurope: (c) => c.region === Region.Europe,
    fromOceania: (c) => c.region === Region.Oceania,
    fromNoRegion: (c) => c.region === null,
    haveFlag: (c) => c.flag != null,
    haveShape: (c) => c.shape != null,
    haveDomain: (c) => c.domain != null && c.domain != "",
    haveCapital: (c) => c.capital != null && c.capital.en != "",
  },
} satisfies DataSourceHelper<Country>;

export const games = [
  {
    name: "Flags",
    description: "Guess countries by their flags",
    id: "flags",
    icon: <RiFlag2Fill />,
    type: "cards",
    data: countries,
    filter: country.selectors.haveFlag,
    display: countriesDisplay.FlagsDisplay,
    answer: country.answer.name,
    groups: [
      { id: "world", filter: country.selectors.independent },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
      { id: "others", filter: country.selectors.fromNoRegion },
    ],
  } satisfies Game<Country>,

  {
    name: "Flags x1",
    description: "Guess countries by their flags",
    id: "flags-x1",
    icon: <RiFlagFill />,
    type: "cards-1x1",
    data: countries,
    filter: country.selectors.haveFlag,
    display: countriesDisplay.FlagsDisplay,
    answer: country.answer.name,
    groups: [
      { id: "world", filter: country.selectors.independent },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
      { id: "others", filter: country.selectors.fromNoRegion },
    ],
  } satisfies Game<Country>,

  {
    name: "World Map",
    description: "Guess countries in the map",
    id: "map",
    icon: <RiMap2Fill />,
    type: "world-map",
    data: countries,
    filter: country.selectors.all,
    answer: country.answer.name,
    groups: [
      { id: "world", filter: country.selectors.all },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
    ],
  } satisfies Game<Country>,

  {
    name: "Shapes",
    description: "Guess countries by their shapes",
    id: "shapes",
    icon: <GiBrazil />,
    type: "cards",
    data: countries,
    filter: country.selectors.haveShape,
    display: countriesDisplay.ShapesDisplay,
    answer: country.answer.name,
    groups: [
      { id: "world", filter: country.selectors.independent },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
      { id: "others", filter: country.selectors.fromNoRegion },
    ],
  } satisfies Game<Country>,

  {
    name: "Capitals",
    description: "Guess countries by their capitals",
    id: "capitals",
    icon: <RiCommunityFill />,
    type: "cards",
    data: countries,
    filter: country.selectors.haveCapital,
    display: countriesDisplay.CapitalsDisplay,
    answer: country.answer.name,
    groups: [
      { id: "world", filter: country.selectors.independent },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
      { id: "others", filter: country.selectors.fromNoRegion },
    ],
  } satisfies Game<Country>,

  {
    name: "Capitals Reversed",
    description: "Guess capitals by country names",
    id: "capitals-2",
    icon: <RiCommunityLine />,
    type: "cards",
    data: countries,
    filter: country.selectors.haveCapital,
    display: countriesDisplay.NamesDisplay,
    answer: country.answer.capital,
    groups: [
      { id: "world", filter: country.selectors.independent },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
      { id: "others", filter: country.selectors.fromNoRegion },
    ],
  } satisfies Game<Country>,

  {
    name: "Domains",
    description: "Guess countries by their domains",
    id: "domains",
    icon: <RiWindow2Fill />,
    type: "cards",
    data: countries,
    filter: country.selectors.haveDomain,
    display: countriesDisplay.DomainsDisplay,
    answer: country.answer.name,
    groups: [
      { id: "world", filter: country.selectors.independent },
      { id: "africa", filter: country.selectors.fromAfrica },
      { id: "america", filter: country.selectors.fromAmerica },
      { id: "asia", filter: country.selectors.fromAsia },
      { id: "europe", filter: country.selectors.fromEurope },
      { id: "oceania", filter: country.selectors.fromOceania },
      { id: "others", filter: country.selectors.fromNoRegion },
    ],
  } satisfies Game<Country>,
] satisfies Game<any>[];

export const findGameByUrl = (url: string /* <game_url>/<group_url> - ex.: flags/america */) => {
  const [gameUrl, groupUrl] = url.split("/");

  const game = games.find((g) => g.id === gameUrl);

  if (!game) return false;

  const group = game.groups.find((g) => g.id === groupUrl);

  if (!group) return false;

  const filteredData = game.data.filter(game.filter).filter(group.filter);

  return {
    name: game.name,
    description: game.description,
    type: game.type,
    answer: game.answer,
    data: game.data,
    filters: { game: game.filter, group: group.filter },
    filteredData: filteredData,
    title: `${upperFirstLetter(group.id)} - ${upperFirstLetter(game.name)}`,
    display: "display" in game ? game.display : undefined,
  };
};
