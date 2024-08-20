import { Country, countries } from "~/data-sources/countries";
import { Region } from "~/data-sources/countries/enums";

const World = {
  id: "africa",
  title: "Africa",
  data: countries,
};

const Africa = {
  id: "africa",
  title: "Africa",
  data: countries,
  filter: (c: Country) => c.region === Region.Africa,
};

const America = {
  id: "america",
  title: "America",
  data: countries,
  filter: (c: Country) => c.region === Region.America,
};

export const types = {
  map: {
    id: "map",
    title: "Map",
    settings: {
      oneByOne: "boolean",
      showBorders: "boolean",
      showNotYetDone: "boolean",
    },
    sources: [World, Africa, America],
  },
  cards: {
    id: "cards",
    title: "Cards",
    settings: {},
  },
};
