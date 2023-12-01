import Link from "next/link";
import React from "react";

import Confetti from "react-confetti";
import ReactDOM from "react-dom";
import { GiPartyPopper } from "react-icons/gi";
import { RiCheckDoubleFill, RiAddLine, RiRestartLine, RiSkipForwardFill } from "react-icons/ri";

import { GuessInput, useGuesser } from "~/features/guesser";
import { playSound } from "~/features/sounds";
import { TimerControl, readableTime } from "~/features/timer";
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
    onCorrectGuess: () => GuessInput.clearById(),
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

  if (guesser.isCompleted) {
    return (
      <Congratulations title={game.title} length={guesser.data.length} totalTime={guesser.totalTime}>
        <div className="flex items-center gap-2">
          <Button color="violet" size="xl" padding="xl" variant="light" onClick={guesser.reset}>
            <RiRestartLine /> Restart
          </Button>
          <Link href="/">
            <Button color="violet" size="xl" padding="xl" variant="outline">
              <RiAddLine /> Play new game
            </Button>
          </Link>
        </div>
      </Congratulations>
    );
  }

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
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
              disabled={guesser.isCompleted}
              autocomplete={game.data
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
      </div>
    </div>
  );
};

export const Congratulations = (props: {
  length: number;
  title: string;
  totalTime: number;
  children?: React.ReactNode;
}) => {
  const [confettis, setConfettis] = React.useState(150);

  React.useEffect(() => {
    setTimeout(() => setConfettis(10), 4000);
  }, []);

  return (
    <div className="max-w-lg px-2 md:px-0 w-full grid place-items-center mx-auto">
      <div className="flex flex-col items-center gap-4">
        {ReactDOM.createPortal(<Confetti numberOfPieces={confettis} />, document.body)}
        <div className="text-purple-500" style={{ animation: "pop 1000ms ease-in-out" }}>
          <GiPartyPopper size={250} />
        </div>
        <div color="gray" className="text-center text-slate-500">
          <div className="text-slate-800 text-4xl font-bold mb-2">Well done!</div>
          You have completed <strong className="text-slate-600">{props.length}</strong> guesses of{" "}
          <span>{'"' + props.title + '"'}</span> in{" "}
          <strong className="text-slate-600">{readableTime(props.totalTime)}</strong>
        </div>
        <div className="my-4">{props.children}</div>
      </div>
    </div>
  );
};
