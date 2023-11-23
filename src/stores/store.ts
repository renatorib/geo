import { proxy } from "valtio";

import { Game } from "~/games";

export const store = proxy({
  open: false,
  selectedGame: null as null | Game<any>,
});

export const storeActions = {
  close() {
    store.open = false;
  },
  open(game: null | Game<any>) {
    store.open = true;
    store.selectedGame = game;
  },
};
