import React from "react";

import { ActionIcon, Text, Box, Center, Group, Input, Tooltip, useMantineTheme, createStyles } from "@mantine/core";
import { QuizLayout } from "~/components/QuizLayout";
import { countries as originalCountries } from "~/countries";
import { RiRefreshLine } from "react-icons/ri";
import { zoomIntoPath } from "~/modules/svg/viewbox";
import { LangSelector } from "~/components/LangSelector";
import { useLang } from "~/hooks";

const useStyles = createStyles((t) => ({
  path: {
    fill: t.colors.gray[3],
    stroke: t.colors.gray[6],
    cursor: "zoom-in",
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
      stroke: t.colors.green[6],
      "&:hover": {
        fill: t.colors.green[5],
        stroke: t.colors.green[6],
      },
      "&.blur": {
        fill: t.colors.green[1],
        stroke: t.colors.green[2],
      },
    },
    "&.selected": {
      cursor: "zoom-out",
    },
  },
}));

const countries = originalCountries.filter((c) => !!c.shape);

const WorldMap = () => {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [selected, setSelected] = React.useState<string>();
  const { property } = useLang();
  const { classes, cx } = useStyles();

  const handleGuess = (_guess: string) => {
    const normalize = (input: string) =>
      input
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/-/gu, " ")
        .toLowerCase()
        .trim();

    for (const country of countries) {
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
        <Center sx={{ position: "absolute", width: "100%" }} pt="xs">
          <Group sx={{ maxWidth: 420, background: "rgba(255, 255, 255, 0.3)", borderRadius: 8 }} p="md" spacing="xs">
            <Box>
              <Text size="xs" color="gray">
                {Object.keys(checked).length} / {countries.length}
              </Text>
            </Box>
            <ActionIcon
              onClick={() => setChecked({})}
              color="violet"
              variant="filled"
              disabled={Object.keys(checked).length === 0}
              radius="xl"
            >
              <RiRefreshLine />
            </ActionIcon>
            <Box>
              <Input<"input">
                styles={{ input: { opacity: 0.7 } }}
                placeholder="Type your guess..."
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
        <svg
          onClick={() => setSelected(undefined)}
          viewBox={(() => {
            const country = countries.find((c) => c.id === selected);
            if (country && country.shape) {
              const { viewbox } = zoomIntoPath(country.shape, 2 / 1);
              return viewbox;
            } else {
              return "0 0 2048 1024";
            }
          })()}
        >
          {countries
            .sort((a, b) => (a.id === selected ? 1 : -1))
            .filter((c) => c.shape)
            .map((c) => {
              return (
                <React.Fragment key={c.id}>
                  <path
                    className={cx(classes.path, {
                      checked: checked[c.id],
                      blur: selected && selected !== c.id,
                      selected: selected === c.id,
                    })}
                    d={c.shape}
                    strokeWidth="0.5px"
                    onClick={(e) => {
                      setSelected((curr) => (curr === c.id ? undefined : c.id));
                      e.stopPropagation();
                    }}
                  ></path>
                </React.Fragment>
              );
            })}
        </svg>
      </Box>
    </QuizLayout>
  );
};

const Void = () => {
  return null;
};

const Children = (props: { children: React.ReactNode } & Record<string, any>) => {
  return <>{props.children}</>;
};

export default WorldMap;
