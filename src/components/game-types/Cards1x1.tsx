import React from "react";

import { RiCheckDoubleFill, RiRestartLine, RiSkipForwardFill } from "react-icons/ri";

import { GuessInput, useGuesser } from "~/features/guesser";
import { playSound } from "~/features/sounds";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";

import { ResponsiveActions } from "../ui/Actions";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";

type Cards1x1Props = {
  game: GameProps;
};

export const Cards1x1 = ({ game }: Cards1x1Props) => {
  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: (node) => GuessInput.clearById(node.id),
  });

  const actions = [
    {
      name: "Reset",
      icon: <RiRestartLine />,
      action: guesser.reset,
      color: "red" as const,
    },
  ];

  const nextUnchecked = guesser.getNextUnchecked(guesser.selectedNode);

  return (
    <div className="max-w-lg px-2 md:px-0 w-full grid place-items-center mx-auto">
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <div className="flex flex-col gap-2 grow w-full">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="font-bold">{game.title}</div>
              <div>
                {guesser.totalChecked} / {guesser.data.length}
              </div>
              <TimerControl timer={guesser.timer} />
            </div>

            <ResponsiveActions actions={actions} />
          </div>
          <div>
            <ProgressBar progress={guesser.totalChecked / guesser.data.length} />
          </div>
        </div>

        <div key={guesser.selectedNode.id} className="shadow rounded-lg overflow-hidden bg-gray-50">
          {game.display
            ? React.createElement(game.display, {
                data: guesser.selectedNode.entity,
                status: guesser.getNodeStatus(guesser.selectedNode),
              })
            : null}
        </div>

        {nextUnchecked && (
          // Pre-render next to prefetch image if have
          <div className="hidden">
            {game.display
              ? React.createElement(game.display, {
                  data: nextUnchecked.entity,
                  status: "hidden",
                })
              : null}
          </div>
        )}

        <div className="flex items-stretch gap-2 mt-2">
          <div className="shadow-lg rounded-md grow">
            <GuessInput
              id={guesser.selectedNode.id}
              name={guesser.getNodeValue(guesser.selectedNode)}
              status={guesser.getNodeStatus(guesser.selectedNode)}
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
              disabled={guesser.isCompleted}
              autoComplete={game.data
                .map((entity) => guesser.getNode(entity))
                .filter(Boolean)
                .map((data) => guesser.getNodeValue(data))}
            />
          </div>

          <Button
            color="violet"
            variant="filled"
            onClick={() => {
              guesser.selectNextNode();
              playSound("wind", { volume: 0.4, playbackRate: 3 });
            }}
          >
            <RiSkipForwardFill /> Skip
          </Button>

          {process.env.NODE_ENV === "development" && (
            <Button
              color="green"
              variant="filled"
              onClick={() => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value)}
            >
              <RiCheckDoubleFill /> Fill
            </Button>
          )}
        </div>

        {guesser.isCompleted && (
          <div className="flex justify-center gap-3 pt-7">
            <Button color="violet" variant="filled" onClick={guesser.reset}>
              <RiRestartLine /> Restart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
