import React from "react";

import { ActionIcon, Text, Box, Center, createStyles, Menu, TextInput, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { RiMore2Fill, RiRefreshLine } from "react-icons/ri";
import { ReactSVGPanZoom, Value, TOOL_PAN } from "react-svg-pan-zoom";

import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";
import { playSound } from "~/features/sounds";
import { Answer } from "~/games";
import { useThrottledEvent, usePooling } from "~/hooks";
import { onNextPaint } from "~/lib/dom";
import { getViewboxOfPath } from "~/lib/svg";

const useStyles = createStyles((t) => ({
  path: {
    fill: t.colors.gray[3],
    stroke: t.colors.gray[6],
    "&.checked": {
      fill: t.colors.green[4],
      stroke: t.colors.green[7],
    },
  },
}));

type WorldMapProps = {
  countries: Country[];
  answer: Answer<Country>;
};

export const WorldMap = (props: WorldMapProps) => {
  const Viewer = React.useRef<ReactSVGPanZoom | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [value, setValue] = React.useState<Value>();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const { width, height } = useViewportSize();
  const [strokeWidth, setStrokeWidth] = React.useState(0.7);
  const { lang } = useSettings();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const countriesToRender = props.countries;
  const countriesToPlay = props.countries.filter((c) => c.independent === true);
  const vb = React.useMemo(() => getViewboxOfPath(countriesToRender.map((c) => c.shape)), []);

  React.useEffect(() => {
    if (Viewer.current) {
      (window as any).viewer = Viewer.current;
      if (!loaded) {
        onNextPaint(() => {
          const x = vb.viewboxX + vb.viewboxWidth / 2;
          const y = vb.viewboxY + vb.viewboxHeight / 2;
          const zoomY = (height - 50) / vb.viewboxHeight;
          const zoomX = width / vb.viewboxWidth;
          Viewer.current?.setPointOnViewerCenter(x, y, Math.min(zoomY, zoomX));
          setLoaded(true);
        });
      }
    }
  }, [Viewer.current]);

  const fixStrokeWidth = (value?: Value | null) => {
    const zoom = value?.a ?? 1;
    setStrokeWidth(0.7 / zoom);
  };

  const handleZoom = useThrottledEvent(fixStrokeWidth, 200);
  usePooling(() => fixStrokeWidth(Viewer?.current?.props?.value), 1000);

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
        const { value, aliases } = props.answer(country, lang.property);
        const answers = [value, ...aliases].map(normalize);
        const guess = normalize(_guess);
        if (answers.includes(guess)) {
          setChecked((c) => ({ ...c, [country.id]: true }));
          playSound("correct");
          return true;
        }
      }
    }

    return false;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Center sx={{ position: "absolute", width: "100%", zIndex: 1, top: 0 }}>
        <Box
          p="sm"
          m="sm"
          sx={{
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
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-50px)",
            transition: "all 300ms ease-in-out",
            willChange: "all",
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Text pl={8} size="sm" color={theme.colors.dark[2]} weight={400}>
              {Object.keys(checked).length} / {countriesToPlay.length}
            </Text>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TextInput
              placeholder="Type country names..."
              onChange={(e) => {
                if (handleGuess(e.target.value)) {
                  e.target.value = "";
                }
              }}
            />
          </Box>
          <Menu withinPortal withArrow width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon color="dark" radius="xl">
                <RiMore2Fill size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setChecked({})} icon={<RiRefreshLine />}>
                Reset
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Center>
      <ReactSVGPanZoom
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease-in-out", willChange: "opacity" }}
        ref={Viewer}
        width={width}
        height={height - 50}
        value={value ?? ({} as any)}
        onChangeValue={setValue}
        tool={TOOL_PAN}
        onChangeTool={() => {}}
        scaleFactorMin={0.3}
        scaleFactorMax={25}
        scaleFactorOnWheel={1.15}
        onPan={handleZoom as any}
        onZoom={handleZoom as any}
        background="#f9f9f9"
        SVGBackground="#f9f9f9"
        customToolbar={() => null}
        customMiniature={() => null}
      >
        <svg viewBox="0 0 1100 666">
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
          {/* <rect
            width={vb.viewboxWidth}
            height={vb.viewboxHeight}
            x={vb.viewboxX}
            y={vb.viewboxY}
            style={{ fill: "rgba(0,0,255,0.01)" }}
           /> */}
        </svg>
      </ReactSVGPanZoom>
    </Box>
  );
};
