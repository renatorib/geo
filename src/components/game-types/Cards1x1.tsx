import Image from "next/image";
import React from "react";

import { RiCheckDoubleFill, RiRestartLine, RiSkipForwardFill } from "react-icons/ri";

import { GuessInput, GuessProgress, useGuesser } from "~/features/guesser";
import { playSound } from "~/features/sounds";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";
import { cn } from "~/lib/styles";

import { Congratulations } from "../Congratulations";
import { MenuActions } from "../ui/Actions";
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
    onCorrectGuess: () => GuessInput.clearById(),
  });

  const actions = [
    {
      name: "Reset",
      icon: <RiRestartLine />,
      action: guesser.reset,
      color: "red" as const,
    },
    {
      name: "Skip",
      icon: <RiSkipForwardFill />,
      action: () => {
        guesser.selectNextNode();
        playSound("wind", { volume: 0.4, playbackRate: 3 });
      },
      color: "violet" as const,
    },
    {
      name: "Fill",
      icon: <RiCheckDoubleFill />,
      action: () => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value),
      color: "green" as const,
      disabled: process.env.NODE_ENV !== "development",
    },
  ];

  const nextUnchecked = guesser.getNextUnchecked(guesser.selectedNode);

  if (guesser.isCompleted) {
    return (
      <Congratulations
        title={game.title}
        length={guesser.data.length}
        totalTime={guesser.totalTime}
        onRestart={() => guesser.reset()}
      />
    );
  }

  return (
    <>
      {guesser.selectedNode.entity.flag && (
        <div
          className={cn(
            "absolute w-full h-full p-2 overflow-hidden",
            "transition-all opacity-10 blur-[100px] scale-75",
            "select-none pointer-events-none",
          )}
        >
          <Image src={guesser.selectedNode.entity.flag} fill alt="" />
        </div>
      )}

      <div className="max-w-lg px-2 md:px-0 w-full grid place-items-center mx-auto">
        <div className="flex flex-col gap-2 md:gap-6 w-full">
          <div className="flex flex-col gap-2 grow w-full">
            <div className="font-serif text-6xl text-center text-lime-300 sm:mb-6">{game.title}</div>
          </div>

          <div className="grow flex gap-1">
            <GuessInput
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
              disabled={guesser.isCompleted}
              autocomplete={game.data
                .map((entity) => guesser.getNode(entity))
                .filter(Boolean)
                .map((data) => guesser.getNodeValue(data))}
            />
          </div>

          <div key={guesser.selectedNode.id} className="relative shadow rounded-lg overflow-hidden bg-stone-950">
            <div className="absolute top-0 right-0 z-10">
              <MenuActions actions={actions} variant="filled" color="stone" className="bg-transparent h-full" />
            </div>
            {game.display
              ? React.createElement(game.display, {
                  data: guesser.selectedNode.entity,
                  status: guesser.getNodeStatus(guesser.selectedNode),
                })
              : null}
          </div>

          <GuessProgress guesser={guesser} />

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

          {/* <Button
            color="violet"
            variant="filled"
            onClick={() => {
              guesser.selectNextNode();
              playSound("wind", { volume: 0.4, playbackRate: 3 });
            }}
          >
            <RiSkipForwardFill /> Skip
          </Button> */}

          {/* process.env.NODE_ENV === "development" && (
            <Button
              color="green"
              variant="filled"
              onClick={() => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value)}
            >
              <RiCheckDoubleFill /> Fill
            </Button>
          ) */}
        </div>
      </div>
    </>
  );
};
