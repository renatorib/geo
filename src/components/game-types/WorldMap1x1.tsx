import React from "react";

import { ActionIcon, Box, Center, Menu, Tooltip } from "@mantine/core";
import { RiFocus2Line, RiMore2Fill, RiRefreshLine, RiSkipForwardLine } from "react-icons/ri";

import { Country } from "~/data-sources/countries";
import { useGuesser, Node, GuessInput } from "~/features/guesser";
import { GameProps } from "~/games";
import { onNextPaint } from "~/lib/dom";
import { cn } from "~/lib/styles";
import { getViewboxOfPath, Viewbox } from "~/lib/svg";

import { SvgPanZoom, ReactSVGPanZoom } from "../SvgPanZoom";

type WorldMapProps = {
  game: GameProps;
};

const MAX_ZOOM = 40;
const MIN_ZOOM = 0.3;

export const WorldMap1x1 = ({ game }: WorldMapProps) => {
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: () => GuessInput.clearById("world-map"),
    onSelectNode: (node) => viewer && zoomOnViewbox(node),
  });

  const zoomOnViewbox = (node: Node<Country>, _viewer?: ReactSVGPanZoom) => {
    const v = viewer || _viewer;
    if (v) {
      const vb = getViewboxOfPath(node.entity.shape, { margin: 4 });
      const { x, y, zoom } = getZoomCoordinates(vb, window.innerWidth, window.innerHeight);
      v.setPointOnViewerCenter(x, y, Math.max(zoom, 2));
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-x-center z-10">
        <div
          className={cn(
            "p-2 m-2 flex items-center justify-between gap-3 border border-solid border-slate-400/20 bg-white/70",
            "backdrop-blur-sm rounded-lg max-w-sm w-full transition-all",
            !!viewer ? "opacity-100 translateY(0)" : "opacity-0 translateY(-50px)",
            "opacity-100 translateY(0)",
          )}
        >
          <div className="flex items-center shrink-0">
            <span className="text-sm text-gray-400">
              {guesser.totalChecked} / {guesser.data.length}
            </span>
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
              <ActionIcon variant="default" size="lg" radius="xl">
                <RiMore2Fill size={18} />
              </ActionIcon>
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
                <Menu.Item onClick={() => zoomOnViewbox(guesser.selectedNode)} leftSection={<RiFocus2Line />}>
                  Re-center
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </div>

        <div className="flex items-center gap-2">
          {viewer && !guesser.isCompleted && (
            <Tooltip label="Re-center">
              <ActionIcon
                variant="filled"
                color="violet"
                size="lg"
                radius="xl"
                onClick={() => zoomOnViewbox(guesser.selectedNode)}
              >
                <RiFocus2Line size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {!guesser.isCompleted && (
            <Tooltip label="Skip">
              <ActionIcon variant="filled" size="lg" radius="xl" onClick={() => guesser.selectNextNode()}>
                <RiSkipForwardLine size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </div>

      <SvgPanZoom
        scaleFactorMax={MAX_ZOOM}
        scaleFactorMin={MIN_ZOOM}
        onRef={setViewer}
        onLoad={(viewer) => onNextPaint(() => zoomOnViewbox(guesser.selectedNode, viewer))}
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

function getZoomCoordinates(vb: Viewbox, width: number, height: number) {
  const x = vb.viewboxX + vb.viewboxWidth / 2;
  const y = vb.viewboxY + vb.viewboxHeight / 2;
  const zoomY = (height - 50) / vb.viewboxHeight;
  const zoomX = width / vb.viewboxWidth;
  const zoom = Math.max(Math.min(zoomY, zoomX, MAX_ZOOM), MIN_ZOOM);

  return { x, y, zoom };
}

// eslint-disable-next-line
function ViewportRectDebug({ vb, strokeWidth }: { vb: Viewbox; strokeWidth: number }) {
  return (
    <rect
      width={vb.viewboxWidth + 2}
      height={vb.viewboxHeight + 2}
      x={vb.viewboxX - 1}
      y={vb.viewboxY - 1}
      style={{ stroke: "rgba(0, 0, 255, 0.3)", fill: "transparent", strokeWidth }}
      rx="1px"
      ry="1px"
      strokeLinejoin="round"
    />
  );
}
