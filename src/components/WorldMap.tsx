import React from "react";

import { ActionIcon, Text, Box, Center, Group, Input, Tooltip, useMantineTheme, createStyles } from "@mantine/core";
import { QuizLayout } from "~/components/QuizLayout";
import { Country } from "~/countries";
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
    "&.disputed": {
      fill: t.colors.gray[7],
    },
  },
}));

export const WorldMap = ({ countries }: { countries: Country[] }) => {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [selected, setSelected] = React.useState<string>();
  const { property } = useLang();
  const { classes, cx } = useStyles();

  const countriesToRender = countries;
  const countriesToPlay = countries.filter((c) => c.independent === true);

  console.log(countriesToRender);

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
        <Center sx={{ position: "absolute", width: "100%" }} pt="xs">
          <Group sx={{ maxWidth: 420, background: "rgba(255, 255, 255, 0.3)", borderRadius: 8 }} p="md" spacing="xs">
            <Box>
              <Text size="xs" color="gray">
                {Object.keys(checked).length} / {countriesToPlay.length}
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
            console.log(country, selected);
            if (country && country.shape) {
              const { viewbox } = zoomIntoPath(country.shape, 1010 / 666);
              return viewbox;
            } else {
              return "0 0 1010 666";
            }
          })()}
        >
          {countriesToRender
            //.sort((a, b) => (a.id === selected ? 1 : -1))
            .map((c) => {
              const isChecked = c.independent ? checked[c.id] : c.sovereignty ? checked[c.sovereignty] : false;
              const isSelected = selected === c.id;
              const isBlur = selected && selected !== c.id;

              return (
                <React.Fragment key={c.id}>
                  <path
                    id={`path-${c.id}`}
                    className={cx(classes.path, {
                      checked: isChecked,
                      blur: isBlur,
                      selected: isSelected,
                    })}
                    d={c.shape}
                    strokeWidth="0.5px"
                    onClick={(e) => {
                      console.log(c);
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
