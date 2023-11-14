import React from "react";

import { ActionIcon, Menu } from "@mantine/core";
import { RiMore2Fill, RiRefreshLine, RiZoomInFill } from "react-icons/ri";

import { GuessInput, useGuesser } from "~/features/guesser";
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

export const WorldMap = ({ game }: WorldMapProps) => {
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: () => GuessInput.clearById("world-map"),
  });

  const zoomOnViewbox = (viewer: ReactSVGPanZoom, vb: Viewbox) => {
    const { x, y, zoom } = getZoomCoordinates(vb, window.innerWidth, window.innerHeight);
    viewer.setPointOnViewerCenter(x, y, zoom);
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
              placeholder="Type country names..."
              onGuess={(text) => guesser.guessAll(text)}
              classNames={{ input: "!border !border-gray-200" }}
            />
          </div>

          <Menu withinPortal withArrow width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" radius="xl">
                <RiMore2Fill size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={guesser.reset} leftSection={<RiRefreshLine />}>
                Reset
              </Menu.Item>
              {viewer && !guesser.isCompleted && (
                <Menu.Item
                  onClick={() => {
                    guesser.selectNextNode();
                    zoomOnViewbox(viewer, getViewboxOfPath(guesser.selectedNode.entity.shape));
                  }}
                  leftSection={<RiZoomInFill />}
                >
                  Zoom on next
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      <SvgPanZoom
        scaleFactorMax={MAX_ZOOM}
        scaleFactorMin={MIN_ZOOM}
        onRef={setViewer}
        onLoad={(viewer) => {
          onNextPaint(() => {
            zoomOnViewbox(viewer, getViewboxOfPath(game.data.map((c) => c.shape)));
          });
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

function getZoomCoordinates(vb: Viewbox, width: number, height: number) {
  const x = vb.viewboxX + vb.viewboxWidth / 2;
  const y = vb.viewboxY + vb.viewboxHeight / 2;
  const zoomY = (height - 50) / vb.viewboxHeight;
  const zoomX = width / vb.viewboxWidth;
  const zoom = Math.min(zoomY, zoomX, MAX_ZOOM);

  return { x, y, zoom };
}

// eslint-disable-next-line
function ViewportRectDebug(vb: Viewbox) {
  return (
    <rect
      width={vb.viewboxWidth}
      height={vb.viewboxHeight}
      x={vb.viewboxX}
      y={vb.viewboxY}
      style={{ fill: "rgba(0,0,255,0.01)" }}
    />
  );
}
