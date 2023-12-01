import React from "react";

import { RiRestartLine } from "react-icons/ri";

import { GuessCard, GuessInput, useGuesser } from "~/features/guesser";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";

import { ResponsiveActions } from "../ui/Actions";
import { FloatingGuessBar } from "../ui/FloatingGuessBar";

type CardsGridProps = {
  game: GameProps;
};

export const CardsGrid = ({ game }: CardsGridProps) => {
  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: () => GuessInput.clearById(),
    onSelectNode: (node) => {
      GuessInput.focusById();
      GuessCard.scrollIntoView(node.id);
    },
  });

  const actions = [
    {
      name: "Reset",
      icon: <RiRestartLine />,
      action: guesser.reset,
      color: "red" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full pt-4">
      <div className="py-4 -mx-2 px-2 bg-white">
        <div className="flex items-center gap-6">
          <div className="font-bold">{game.title}</div>
          <ResponsiveActions actions={actions} />
        </div>
      </div>

      <div className="shadow-lg rounded mb-16 sticky top-1 z-10">
        <FloatingGuessBar full={true}>
          <div className="shrink-0 text-sm text-gray-600">
            {guesser.totalChecked} / {guesser.data.length}
          </div>
          <div className="grow">
            <GuessInput
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
              disabled={guesser.isCompleted}
              autocomplete={game.data
                .map((entity) => guesser.getNode(entity))
                .filter(Boolean)
                .map((data) => guesser.getNodeValue(data))}
            />
          </div>
          <TimerControl timer={guesser.timer} />
        </FloatingGuessBar>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {guesser.data.map((node) => {
          const status = guesser.getNodeStatus(node);

          return (
            <div key={node.id}>
              <GuessCard
                id={node.id}
                status={status}
                selected={guesser.isNodeSelected(node)}
                onClick={() => guesser.setSelectedNode(node)}
              >
                {game.display ? React.createElement(game.display, { data: node.entity, status }) : null}
              </GuessCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
