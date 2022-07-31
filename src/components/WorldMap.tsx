import React from "react";

import { ReactSVGPanZoom, Value, TOOL_PAN } from "react-svg-pan-zoom";
import { ActionIcon, Text, Box, Center, createStyles, Menu, TextInput, useMantineTheme } from "@mantine/core";
import { Country } from "~/countries";
import { RiMore2Fill, RiRefreshLine } from "react-icons/ri";
import { useLang, useDebouncedEvent, usePooling } from "~/hooks";
import { useViewportSize } from "@mantine/hooks";

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

export const WorldMap = ({ countries }: { countries: Country[] }) => {
  const Viewer = React.useRef<ReactSVGPanZoom | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [value, setValue] = React.useState<Value>();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const { width, height } = useViewportSize();
  const [strokeWidth, setStrokeWidth] = React.useState(0.7);
  const { property } = useLang();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const countriesToRender = countries;
  const countriesToPlay = countries.filter((c) => c.independent === true);

  React.useEffect(() => {
    Viewer.current?.setPointOnViewerCenter(1010 / 2, 660 / 2, 1.2);
    setLoaded(true);
  }, []);

  const fixStrokeWidth = (value?: Value | null) => {
    const zoom = value?.a ?? 1;
    setStrokeWidth(0.7 / zoom);
  };

  const handleZoom = useDebouncedEvent(fixStrokeWidth, 300);
  usePooling(() => fixStrokeWidth(Viewer?.current?.props?.value), 2000);

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
        customToolbar={() => null}
        background="#f9f9f9"
        SVGBackground="#f9f9f9"
        customMiniature={() => null}
        // miniatureProps={{ background: "white", height: 60, width: 100, position: "right" }}
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
  );
};
