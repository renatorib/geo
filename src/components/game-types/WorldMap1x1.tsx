import React from "react";

import { ActionIcon, Box, Center, Menu, Tooltip } from "@mantine/core";
import { RiFocus2Line, RiMore2Fill, RiRefreshLine, RiSkipForwardLine } from "react-icons/ri";

import { Country } from "~/data-sources/countries";
import { useGuesser, Node } from "~/features/guesser";
import { Answer } from "~/games";
import { onNextPaint } from "~/lib/dom";
import { cn } from "~/lib/styles";
import { getViewboxOfPath, Viewbox } from "~/lib/svg";

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

export const WorldMap1x1 = (props: WorldMapProps) => {
  const [viewer, setViewer] = React.useState<ReactSVGPanZoom>();
  const [value, setValue] = React.useState<Value>();

  const guesser = useGuesser({
    data: props.data,
    answer: props.answer,
    title: props.title,
    onCorrectGuess: () => QuizInput.clearById("world-map"),
    onSelectNode: (node) => viewer && zoomOnViewbox(node),
  });

  const zoomOnViewbox = (node: Node<Country>, _viewer?: ReactSVGPanZoom) => {
    const v = viewer || _viewer;
    if (v) {
      const vb = getViewboxOfPath(node.entity.shape, { margin: 4 });
      console.log(vb);
      const { x, y, zoom } = getZoomCoordinates(vb, window.innerWidth, window.innerHeight);
      v.setPointOnViewerCenter(x, y, Math.max(zoom, 2));
    }
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
              placeholder="Type country name..."
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
              classNames={{ input: "!border !border-gray-200" }}
              autoComplete={props.dataToRender
                .map((entity) => guesser.getNode(entity))
                .filter(Boolean)
                .map((data) => guesser.getNodeValue(data))}
            />
          </Box>

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
        </Box>

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
      </Center>

      <SvgPanZoom
        scaleFactorMax={MAX_ZOOM}
        scaleFactorMin={MIN_ZOOM}
        onChangeValue={setValue}
        onRef={setViewer}
        onLoad={(viewer) => onNextPaint(() => zoomOnViewbox(guesser.selectedNode, viewer))}
      >
        <svg viewBox="0 0 1100 666">
          {props.dataToRender
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

              const strokeWidth = 0.7 / (value?.a ?? 1);
              const focusedStrokeWidth = 2.5 / (value?.a ?? 1);

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
                      className={cn(
                        "fill-gray-300 stroke-gray-600",
                        isChecked && "fill-green-400 stroke-green-700",
                        isFocused && !isChecked && "fill-violet-400 stroke-violet-700",
                      )}
                      strokeWidth={isFocused ? focusedStrokeWidth : strokeWidth}
                      strokeDasharray={node.entity.disputed ? strokeWidth * 10 : undefined}
                      filter={isFocused ? "drop-shadow(0px 0px 1px rgba(109, 40, 217, 0.5)" : ""}
                      d={node.entity.shape}
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
    </Box>
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
