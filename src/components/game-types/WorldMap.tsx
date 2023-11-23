import React from "react";

import { RiFocus3Line, RiRefreshLine } from "react-icons/ri";

import { GuessInput, useGuesser } from "~/features/guesser";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";
import { cn } from "~/lib/styles";
import { getViewboxOfPath } from "~/lib/svg";

import { SvgPanZoom, ReactSVGPanZoom } from "../SvgPanZoom";
import { ResponsiveActions } from "../ui/Actions";
import { FloatingGuessBar } from "../ui/FloatingGuessBar";

type WorldMapProps = {
  game: GameProps;
};

export const WorldMap = ({ game }: WorldMapProps) => {
  const [loaded, setLoaded] = React.useState(false);
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: () => GuessInput.clearById("world-map"),
  });

  const actions = [
    {
      name: "Reset",
      icon: <RiRefreshLine />,
      action: guesser.reset,
      color: "red" as const,
    },
    {
      name: "Re-position",
      icon: <RiFocus3Line />,
      disabled: !viewer || guesser.isCompleted,
      action: () => {
        guesser.selectNextNode();
        viewer && SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(game.data.map((c) => c.shape)));
      },
    },
  ];

  return (
    <div className="relative">
      <FloatingGuessBar hidden={!loaded}>
        <div className="flex items-center shrink-0 text-sm text-gray-400">
          {guesser.totalChecked} / {guesser.data.length}
        </div>

        <div className="grow">
          <GuessInput
            id="world-map"
            name="world-map"
            placeholder="Type country names..."
            onGuess={(text) => guesser.guessAll(text)}
            classNames={{ input: "!border !border-gray-200" }}
          />
        </div>

        <ResponsiveActions actions={actions} />

        <TimerControl timer={guesser.timer} />
      </FloatingGuessBar>

      <SvgPanZoom
        onRef={setViewer}
        onLoad={(viewer) => {
          setLoaded(true);
          SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(game.data.map((c) => c.shape)));
        }}
      >
        <svg viewBox="0 0 1100 666">
          {game.data.map((c) => {
            const node = guesser.data.find((n) => n.id === c.id);

            if (!node) {
              const isChecked = c.sovereignty && (guesser.data.find((n) => n.id === c.sovereignty)?.checked || false);
              return (
                <React.Fragment key={c.id}>
                  <path
                    id={`path-${c.id}`}
                    d={c.shape}
                    className={cn("stroke-transparent", isChecked ? "fill-green-400" : "fill-gray-200")}
                  />
                </React.Fragment>
              );
            }

            const isChecked = node.entity.independent
              ? node.checked
              : node.entity.sovereignty
              ? guesser.data.find((n) => n.id === node.entity.sovereignty)?.checked || false
              : false;

            return (
              <React.Fragment key={node.id}>
                <path
                  id={`path-${node.id}`}
                  className={cn("fill-gray-300 stroke-gray-600", isChecked && "fill-green-400 stroke-green-700")}
                  d={node.entity.shape}
                  style={{
                    strokeWidth: "calc(0.7 / var(--viewer-zoom, 1))",
                    strokeDasharray: node.entity.disputed ? "calc((0.7 / var(--viewer-zoom, 1)) * 10)" : undefined,
                  }}
                />
              </React.Fragment>
            );
          })}
        </svg>
      </SvgPanZoom>
    </div>
  );
};
