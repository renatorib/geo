import { proxy } from "valtio";

import { Game } from "~/games";

export const store = proxy({
  selectedGame: null as null | Game<any>,
});

export const storeActions = {
  setSelectedGame(game: null | Game<any>) {
    store.selectedGame = game;
  },
};
