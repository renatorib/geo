import React from "react";

import { ActionIcon, Box, Center, Menu } from "@mantine/core";
import { RiMore2Fill, RiRefreshLine, RiZoomInFill } from "react-icons/ri";

import { Country } from "~/data-sources/countries";
import { useGuesser } from "~/features/guesser";
import { Answer } from "~/games";
import { onNextPaint } from "~/lib/dom";
import { getViewboxOfPath, Viewbox } from "~/lib/svg";
import { cn } from "~/styles";

import { QuizInput } from "../QuizInput";
import { SvgPanZoom, ReactSVGPanZoom, Value } from "../SvgPanZoom";

type WorldMapProps = {
  data: Country[];
  dataToRender: Country[];
  answer: Answer<Country>;
  title: string;
};

const MAX_ZOOM = 40;
const MIN_ZOOM = 0.3;

export const WorldMap = (props: WorldMapProps) => {
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();
  const [value, setValue] = React.useState<Value>();

  const guesser = useGuesser({
    data: props.data,
    answer: props.answer,
    title: props.title,
    refocus: false,
    onCorrectGuess() {
      QuizInput.clearInputById("world-map");
    },
  });

  const zoomOnViewbox = (viewer: ReactSVGPanZoom, vb: Viewbox) => {
    const { x, y, zoom } = getZoomCoordinates(vb, window.innerWidth, window.innerHeight);
    viewer.setPointOnViewerCenter(x, y, zoom);
  };

  return (
    <Box style={{ position: "relative" }}>
      <Center style={{ position: "absolute", width: "100%", zIndex: 1, top: 0 }}>
        <Box
          p="sm"
          m="sm"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            border: "1px solid rgba(200, 200, 200, 0.4)",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(2px)",
            borderRadius: 8,
            maxWidth: 400,
            width: "100%",
            opacity: value ? 1 : 0,
            transform: value ? "translateY(0)" : "translateY(-50px)",
            transition: "all 300ms ease-in-out",
            willChange: "all",
          }}
        >
          <Box style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <span className="text-sm text-gray-400">
              {guesser.totalChecked} / {guesser.data.length}
            </span>
          </Box>

          <Box style={{ flexGrow: 1 }}>
            <QuizInput
              id="world-map"
              name="world-map"
              placeholder="Type country names..."
              onGuess={(text) => guesser.guessAll(text)}
              classNames={{ input: "!border !border-gray-200" }}
            />
          </Box>

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
        </Box>
      </Center>

      <SvgPanZoom
        scaleFactorMax={MAX_ZOOM}
        scaleFactorMin={MIN_ZOOM}
        onChangeValue={setValue}
        onRef={setViewer}
        onLoad={(viewer) => {
          onNextPaint(() => {
            zoomOnViewbox(viewer, getViewboxOfPath(props.data.map((c) => c.shape)));
          });
        }}
      >
        <svg viewBox="0 0 1100 666">
          {props.dataToRender.map((c) => {
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

            const strokeWidth = 0.7 / (value?.a ?? 1);
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
                  strokeWidth={strokeWidth}
                  strokeDasharray={node.entity.disputed ? strokeWidth * 10 : undefined}
                  d={node.entity.shape}
                />
              </React.Fragment>
            );
          })}
        </svg>
      </SvgPanZoom>
    </Box>
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
