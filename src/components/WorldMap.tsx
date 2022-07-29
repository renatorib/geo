import React from "react";

import { ReactSVGPanZoom, Value, TOOL_PAN } from "react-svg-pan-zoom";
import { ActionIcon, Text, Box, Center, Group, Input, createStyles, Menu, Badge } from "@mantine/core";
import { QuizLayout } from "~/components";
import { Country } from "~/countries";
import { RiMore2Fill, RiRefreshLine } from "react-icons/ri";
import { LangSelector } from "~/components/LangSelector";
import { useEvent, useLang, useThrottledEvent } from "~/hooks";

const useStyles = createStyles((t) => ({
  path: {
    fill: t.colors.gray[3],
    stroke: t.colors.gray[6],
    "&:hover": {
      fill: t.colors.gray[4],
    },
    "&.blur": {
      fill: t.colors.gray[1],
      stroke: t.colors.gray[3],
      "&:hover": {
        fill: t.colors.gray[2],
      },
    },
    "&.checked": {
      fill: t.colors.green[4],
      stroke: t.colors.green[7],
      "&:hover": {
        fill: t.colors.green[5],
        stroke: t.colors.green[8],
      },
      "&.blur": {
        fill: t.colors.green[1],
        stroke: t.colors.green[2],
      },
    },
    "&.selected": {
      cursor: "zoom-out",
    },
    "&.disputed": {
      fill: t.colors.gray[7],
    },
  },
}));

export const WorldMap = ({ countries }: { countries: Country[] }) => {
  const Viewer = React.useRef<ReactSVGPanZoom | null>(null);
  const [value, setValue] = React.useState<Value>();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const { width, height } = useMainSize({ initialHeight: 666, initialWidth: 1010 });
  const [strokeWidth, setStrokeWidth] = React.useState(0.5);
  const { property } = useLang();
  const { classes, cx } = useStyles();

  const countriesToRender = countries;
  const countriesToPlay = countries.filter((c) => c.independent === true);

  React.useEffect(() => {
    Viewer.current?.fitToViewer();
    Viewer.current?.zoomOnViewerCenter(1);
    (window as any).v = Viewer.current;
  }, []);

  const handleZoom = useThrottledEvent((value: Value) => {
    const zoom = value?.a ?? 1;
    setStrokeWidth(0.5 / zoom);
  }, 500);

  const handleGuess = (_guess: string) => {
    const normalize = (input: string) =>
      input
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/-/gu, " ")
        .toLowerCase()
        .trim();

    for (const country of countriesToPlay) {
      if (!checked[country.id]) {
        const answers = [country.name[property], ...country.alias[property]].map(normalize);
        const guess = normalize(_guess);
        if (answers.includes(guess)) {
          setChecked((c) => ({ ...c, [country.id]: true }));
          return true;
        }
      }
    }

    return false;
  };

  return (
    <QuizLayout>
      <Box sx={{ position: "relative" }} m="-md">
        <Center sx={{ position: "absolute", width: "100%", zIndex: 1 }} pt="xs">
          <Group sx={{ background: "rgba(255, 255, 255, 0.7)", borderRadius: 8, maxWidth: 420 }} p="xs" spacing="xs">
            <Menu withinPortal withArrow width={200}>
              <Menu.Target>
                <ActionIcon color="gray" radius="xl">
                  <RiMore2Fill size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setChecked({})} icon={<RiRefreshLine />}>
                  Reset
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Box>
              <Text size="sm" color="dimmed" weight={400}>
                {Object.keys(checked).length} / {countriesToPlay.length}
              </Text>
            </Box>
            <Box>
              <Input<"input">
                sx={{ input: { opacity: 0.8, maxWidth: 180, "&:focus": { opacity: 1 } } }}
                placeholder="Type country names..."
                onChange={(e) => {
                  if (handleGuess(e.target.value)) {
                    e.target.value = "";
                  }
                }}
              />
            </Box>

            <LangSelector />
          </Group>
        </Center>
        <ReactSVGPanZoom
          ref={Viewer}
          width={width - 1}
          height={height - 1}
          value={value ?? ({} as any)}
          onChangeValue={setValue}
          tool={TOOL_PAN}
          onChangeTool={() => {}}
          scaleFactorMin={0.3}
          scaleFactorMax={25}
          scaleFactorOnWheel={1.15}
          preventPanOutside={true}
          onZoom={handleZoom as any}
          customToolbar={() => null}
          customMiniature={() => null}
          background="#f9f9f9"
          SVGBackground="#f9f9f9"
        >
          <svg viewBox="0 0 1010 666">
            {countriesToRender.map((c) => {
              const isChecked = c.independent ? checked[c.id] : c.sovereignty ? checked[c.sovereignty] : false;

              return (
                <React.Fragment key={c.id}>
                  <path
                    id={`path-${c.id}`}
                    className={cx(classes.path, { checked: isChecked })}
                    strokeWidth={strokeWidth}
                    strokeDasharray={c.disputed ? strokeWidth * 10 : undefined}
                    d={c.shape}
                  ></path>
                </React.Fragment>
              );
            })}
          </svg>
        </ReactSVGPanZoom>
      </Box>
    </QuizLayout>
  );
};

function useMainSize({ initialWidth = 0, initialHeight = 0 }: { initialWidth?: number; initialHeight?: number }) {
  const [width, setWidth] = React.useState(initialWidth);
  const [height, setHeight] = React.useState(initialHeight);

  const snapshot = useEvent(() => {
    const main = document.querySelector("main");
    const width = main?.clientWidth ?? initialWidth;
    const height = main?.clientHeight ?? initialHeight;
    setWidth(width);
    setHeight(height);
  });

  React.useEffect(() => {
    snapshot();
    const options = { passive: true };
    window.addEventListener("resize", snapshot, options);
    window.addEventListener("orientationchange", snapshot, options);
    return () => {
      window.removeEventListener("resize", snapshot, options as any);
      window.removeEventListener("orientationchange", snapshot, options as any);
    };
  }, []); // eslint-disable-line

  return { width, height };
}
