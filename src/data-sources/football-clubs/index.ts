export const footballClubs = [
  {
    id: "spfc",
    name: "São Paulo Futebol Clube",
    logo: "https://upload.wikimedia.org/wikipedia/pt/4/4b/S%C3%A3o_Paulo_Futebol_Clube.png",
  },
  {
    id: "sfc",
    name: "Santos Futebol Clube",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_logo.svg/1024px-Santos_logo.svg.png",
  },
];

export type FootballClub = (typeof footballClubs)[number];
