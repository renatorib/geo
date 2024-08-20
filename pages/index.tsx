import React from "react";

import { RiLayoutGridLine, RiSquareLine } from "react-icons/ri";

import { AppLayout } from "~/components";
import { Game, games } from "~/games";
import { cn, contextColors } from "~/lib/styles";
import { storeActions } from "~/stores/store";

const Index = () => {
  return (
    <AppLayout>
      <div className="w-full flex flex-col justify-center my-8">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="text-lg font-bold flex items-center gap-2">
              <RiSquareLine /> One by one quiz
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {games
                .filter((g) => g.training === false)
                .map((game) => (
                  <GameCard key={game.name} game={game} color="yellow" />
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-lg font-bold flex items-center gap-2">
              <RiLayoutGridLine /> Grid quiz
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {games
                .filter((g) => g.training === true)
                .map((game) => (
                  <GameCard key={game.name} game={game} color="slate" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const GameCard = ({ game, color }: { game: Game<any>; color?: keyof typeof contextColors }) => {
  return (
    <button
      onClick={() => storeActions.open(game)}
      className={cn(
        "group flex items-center gap-3 w-full p-4 rounded",
        "cursor-pointer border border-slate-300 select-none transition-all",
        "bg-slate-50 hover:bg-context-900 hover:shadow-md active:bg-context-600 active:shadow-inner",
        contextColors[color ?? "slate"],
      )}
    >
      <div
        className={cn(
          "flex text-5xl text-context-600 transition",
          "group-hover:text-context-200 group-hover:-translate-x-1 group-hover:-translate-y-1",
          "group-hover:scale-110 group-hover:drop-shadow-lg",
          "group-active:text-context-200 group-active:-translate-x-1 group-active:-translate-y-1",
          "group-active:scale-110 group-active:drop-shadow-lg",
        )}
      >
        {game.icon}
      </div>
      <div className="flex flex-col gap-1 text-left">
        <div className="font-bold text-context-800 group-hover:text-context-100 group-active:text-context-100 transition">
          {game.name}
        </div>
        <div className="text-sm text-slate-600 group-hover:text-slate-400 group-active:text-slate-100 transition">
          {game.description}
        </div>
      </div>
    </button>
  );
};

export default Index;
