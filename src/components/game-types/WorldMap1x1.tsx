import React from "react";

import { Menu, Tooltip } from "@mantine/core";
import { RiFocus2Line, RiMore2Fill, RiRefreshLine, RiSkipForwardLine } from "react-icons/ri";

import { useGuesser, GuessInput } from "~/features/guesser";
import { GameProps } from "~/games";
import { cn } from "~/lib/styles";
import { getViewboxOfPath } from "~/lib/svg";

import { SvgPanZoom, ReactSVGPanZoom } from "../SvgPanZoom";
import { ButtonIcon } from "../ui/ButtonIcon";
import { FloatingGuessBar } from "../ui/FloatingGuessBar";

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

  return (
    <div className="relative">
      <FloatingGuessBar hidden={!loaded}>
        <div className="flex items-center shrink-0 text-sm text-gray-500">
          {guesser.totalChecked} / {guesser.data.length}
        </div>

        <div className="grow">
          <GuessInput
            id="world-map"
            name="world-map"
            placeholder="Type country name..."
            onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
            classNames={{ input: "!border !border-gray-200" }}
            autoComplete={game.data
              .map((entity) => guesser.getNode(entity))
              .filter(Boolean)
              .map((data) => guesser.getNodeValue(data))}
          />
        </div>

        <Menu withinPortal withArrow width={200} position="bottom-end">
          <Menu.Target>
            <ButtonIcon variant="outline" size="lg" radius="full">
              <RiMore2Fill />
            </ButtonIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={guesser.reset} leftSection={<RiRefreshLine />}>
              Reset
            </Menu.Item>
            {!guesser.isCompleted && (
              <Menu.Item onClick={() => guesser.selectNextNode()} leftSection={<RiSkipForwardLine />}>
                Skip
              </Menu.Item>
            )}
            {viewer && !guesser.isCompleted && (
              <Menu.Item
                leftSection={<RiFocus2Line />}
                onClick={() =>
                  SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape, { margin: 5 }))
                }
              >
                Re-center
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>

        {viewer && !guesser.isCompleted && (
          <Tooltip label="Re-center">
            <ButtonIcon
              variant="filled"
              color="violet"
              size="lg"
              radius="full"
              onClick={() =>
                SvgPanZoom.zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape, { margin: 5 }))
              }
            >
              <RiFocus2Line size={18} />
            </ButtonIcon>
          </Tooltip>
        )}

        {!guesser.isCompleted && (
          <Tooltip label="Skip">
            <ButtonIcon variant="filled" size="lg" radius="full" onClick={() => guesser.selectNextNode()}>
              <RiSkipForwardLine size={18} />
            </ButtonIcon>
          </Tooltip>
        )}
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
