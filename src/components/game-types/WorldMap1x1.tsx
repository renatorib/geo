import Link from "next/link";
import React from "react";

import {
  RiAddLine,
  RiCheckDoubleFill,
  RiFocus2Line,
  RiRefreshLine,
  RiRestartLine,
  RiSkipForwardLine,
} from "react-icons/ri";

import { useGuesser, GuessInput } from "~/features/guesser";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";
import { cn } from "~/lib/styles";
import { getViewboxOfPath } from "~/lib/svg";

import { SvgPanZoom, ReactSVGPanZoom } from "../SvgPanZoom";
import { ResponsiveActions } from "../ui/Actions";
import { Button } from "../ui/Button";
import { FloatingGuessBar } from "../ui/FloatingGuessBar";

import { Congratulations } from "./Cards1x1";

type WorldMapProps = {
  game: GameProps;
};

export const WorldMap1x1 = ({ game }: WorldMapProps) => {
  const [loaded, setLoaded] = React.useState(false);
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: () => GuessInput.clearById("world-map"),
    onSelectNode: (node) =>
      viewer && SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(node.entity.shape, { margin: 5 })),
  });

  const actions = [
    {
      name: "Reset",
      icon: <RiRefreshLine />,
      action: guesser.reset,
      color: "red" as const,
    },
    process.env.NODE_ENV === "development" && {
      name: "Fill",
      icon: <RiCheckDoubleFill />,
      action: () => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value),
    },
    {
      name: "Re-center",
      icon: <RiFocus2Line />,
      disabled: !viewer || guesser.isCompleted,
      action: () =>
        viewer && SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape, { margin: 5 })),
    },
    {
      name: "Skip",
      icon: <RiSkipForwardLine />,
      disabled: guesser.isCompleted,
      action: () => guesser.selectNextNode(),
    },
  ].filter(Boolean);

  if (guesser.isCompleted) {
    return (
      <Congratulations title={game.title} length={guesser.data.length} totalTime={guesser.totalTime}>
        <div className="flex items-center gap-2">
          <Button color="violet" size="xl" padding="xl" variant="light" onClick={guesser.reset}>
            <RiRestartLine /> Play again
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
    <div className="relative">
      <FloatingGuessBar hidden={!loaded}>
        <div className="shrink-0 text-sm text-gray-500">
          {guesser.totalChecked} / {guesser.data.length}
        </div>

        <div className="grow">
          <GuessInput
            id="world-map"
            name="world-map"
            placeholder="Type country name..."
            onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
            className="!border !border-gray-200"
            autoComplete={game.data
              .map((entity) => guesser.getNode(entity))
              .filter(Boolean)
              .map((data) => guesser.getNodeValue(data))}
          />
        </div>

        <ResponsiveActions actions={actions} />

        <TimerControl timer={guesser.timer} />
      </FloatingGuessBar>

      <SvgPanZoom
        onRef={setViewer}
        onLoad={(viewer) => {
          setLoaded(true);
          SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape, { margin: 5 }));
        }}
      >
        <svg viewBox="0 0 1100 666">
          {game.data
            .map((c) => {
              const node = guesser.data.find((n) => n.id === c.id);

              if (!node) {
                const isChecked = c.sovereignty && (guesser.data.find((n) => n.id === c.sovereignty)?.checked || false);
                return {
                  isChecked,
                  isFocused: false,
                  path: (
                    <React.Fragment key={c.id}>
                      <path
                        id={`path-${c.id}`}
                        d={c.shape}
                        className={cn("stroke-transparent", isChecked ? "fill-green-400" : "fill-gray-200")}
                      />
                    </React.Fragment>
                  ),
                };
              }

              const isChecked = node.entity.independent
                ? node.checked
                : node.entity.sovereignty
                ? guesser.data.find((n) => n.id === node.entity.sovereignty)?.checked || false
                : false;

              const isFocused =
                guesser.selectedNode.id === node.id ||
                (node.entity.sovereignty &&
                  guesser.data.find((n) => n.id === node.entity.sovereignty)?.id === guesser.selectedNode.id);

              return {
                isFocused,
                isChecked,
                path: (
                  <React.Fragment key={node.id}>
                    <path
                      id={`path-${node.id}`}
                      d={node.entity.shape}
                      className={cn(
                        "fill-gray-300 stroke-gray-600",
                        isChecked && "fill-green-400 stroke-green-700",
                        isFocused && !isChecked && "fill-violet-400 stroke-violet-700",
                      )}
                      style={{
                        strokeWidth: isFocused
                          ? "calc(2.5 / var(--viewer-zoom, 1))"
                          : "calc(0.7 / var(--viewer-zoom, 1))",
                        strokeDasharray: node.entity.disputed ? "calc((0.7 / var(--viewer-zoom, 1)) * 10)" : undefined,
                        filter: isFocused ? "drop-shadow(0px 0px 1px rgba(109, 40, 217, 0.5)" : undefined,
                      }}
                    />
                  </React.Fragment>
                ),
              };
            })
            .sort((a, b) => {
              // ensure focused path is always rendered last
              // so its collapsing borders are always visible
              const z = (i: typeof a) => (i.isFocused ? 1 : 0);
              return z(a) - z(b);
            })
            .map((item) => item.path)}
        </svg>
      </SvgPanZoom>
    </div>
  );
};
