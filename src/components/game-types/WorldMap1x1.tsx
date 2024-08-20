import React from "react";

import { RiCheckDoubleFill, RiFocus2Line, RiRefreshLine, RiSkipForwardLine } from "react-icons/ri";

import { useGuesser, GuessInput, GuessProgress } from "~/features/guesser";
import { GameProps } from "~/games";
import { cn } from "~/lib/styles";
import { getViewboxOfPath } from "~/lib/svg";

import { Congratulations } from "../Congratulations";
import { SvgPanZoom, ReactSVGPanZoom } from "../SvgPanZoom";
import { MenuActions } from "../ui/Actions";
import { FloatingGuessBar } from "../ui/FloatingGuessBar";

type WorldMapProps = {
  game: GameProps;
  oneByOne?: boolean;
  hideBorders?: boolean;
  hideUnchecked?: boolean;
};

const HIGHLIGHT_SELECTED = true;

export const WorldMap1x1 = ({ game, oneByOne = true, hideBorders = false, hideUnchecked = false }: WorldMapProps) => {
  const [loaded, setLoaded] = React.useState(false);
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();

  const HAS_BORDERS = !hideBorders;
  const SHOW_UNCHECKED = !hideUnchecked;

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: () => GuessInput.clearById(),
    onSelectNode: (node) =>
      oneByOne && viewer && SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(node.entity.shape, { margin: 5 })),
  });

  const actions = [
    {
      name: "Reset",
      icon: <RiRefreshLine />,
      action: guesser.reset,
      color: "red" as const,
    },
    {
      name: "Re-center",
      icon: <RiFocus2Line />,
      action: () =>
        viewer && SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape, { margin: 5 })),
      disabled: !viewer || guesser.isCompleted,
    },
    {
      name: "Skip",
      icon: <RiSkipForwardLine />,
      action: () => guesser.selectNextNode(),
      disabled: guesser.isCompleted,
    },
    {
      name: "Fill",
      icon: <RiCheckDoubleFill />,
      action: () => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value),
      disabled: process.env.NODE_ENV !== "development",
    },
  ];

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
    <div className="relative">
      <FloatingGuessBar hidden={!loaded}>
        <div className="grow">
          <GuessInput
            placeholder="Type country name..."
            onGuess={(text) => {
              oneByOne ? guesser.guess(guesser.selectedNode, text) : guesser.guessAll(text);
            }}
            autocomplete={
              oneByOne
                ? game.data
                    .map((entity) => guesser.getNode(entity))
                    .filter(Boolean)
                    .map((data) => guesser.getNodeValue(data))
                : undefined
            }
          />
        </div>
      </FloatingGuessBar>

      <div className="absolute right-2 top-4 z-10 flex items-center gap-2">
        <MenuActions actions={actions} />
      </div>

      <div className="absolute sm:inset-x-center right-0 left-0 sm:left-auto sm:right-auto bottom-1 z-10 w-full max-w-lg">
        <GuessProgress guesser={guesser} />
      </div>

      <div className="w-[var(--main-width)] h-[var(--main-height)]">
        <SvgPanZoom
          background="rgb(28, 25, 23)"
          onRef={setViewer}
          onLoad={(viewer) => {
            setLoaded(true);
            if (oneByOne) {
              SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape, { margin: 5 }));
            } else {
              SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(game.filteredData.map((c) => c.shape)));
            }
          }}
        >
          <svg viewBox="0 0 1100 666">
            {game.data
              .map((c) => {
                const node = guesser.data.find((n) => n.id === c.id);

                if (!node) {
                  const isChecked =
                    c.sovereignty && (guesser.data.find((n) => n.id === c.sovereignty)?.checked || false);
                  return {
                    isChecked,
                    isFocused: false,
                    path: (
                      <React.Fragment key={c.id}>
                        <path
                          id={`path-${c.id}`}
                          d={c.shape}
                          className={cn(
                            "stroke-transparent",
                            SHOW_UNCHECKED ? (isChecked ? "fill-stone-700" : "fill-stone-800/20") : "fill-transparent",
                          )}
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

                const highlightFocused = !!isFocused && !isChecked && HIGHLIGHT_SELECTED && oneByOne;

                return {
                  isFocused,
                  isChecked,
                  path: (
                    <React.Fragment key={node.id}>
                      <path
                        id={`path-${node.id}`}
                        d={node.entity.shape}
                        className={cn(
                          cn(SHOW_UNCHECKED ? "fill-stone-800" : "fill-transparent", HAS_BORDERS && "stroke-stone-700"),
                          isChecked && "fill-stone-950/40",
                          highlightFocused && "fill-lime-400",
                        )}
                        style={{
                          strokeWidth: HAS_BORDERS ? getStrokeWidth(highlightFocused) : 0,
                          filter: highlightFocused ? "drop-shadow(0px 0px 3px #a3e63533)" : undefined,
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
    </div>
  );
};

const getStrokeWidth = (tick = false) => {
  return tick ? "calc(2.5 / var(--viewer-zoom, 1))" : "calc(0.7 / var(--viewer-zoom, 1))";
};
