import React from "react";
import NextImage, { StaticImageData } from "next/image";
import * as flags from "../countries/flags";
import {
  Card,
  Text,
  Group,
  Input,
  Box,
  AspectRatio,
  Stack,
  useMantineTheme,
  Grid,
  ActionIcon,
  Menu,
  Switch,
  UnstyledButton,
} from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import {
  RiCheckLine,
  RiShuffleFill,
  RiEyeLine,
  RiMore2Fill,
  RiMicLine,
  RiEyeCloseLine,
  RiRestartLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { Country } from "../countries";

export const Quiz = (props: { countries: Country[]; title: string }) => {
  const [, rerender] = React.useState(0);
  const [lang] = useLocalStorage({ key: "gtf:lang", defaultValue: "en-us" });
  const large = useMediaQuery("(min-width: 1023px)");
  const [spoiler, setSpoiler] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [countries, setCountries] = React.useState(() => shuffle(props.countries));

  const shuffleCountries = () => {
    setCountries((c) => shuffle(c));
    rerender((r) => r + 1);
  };

  const toggleSpoiler = () => {
    setSpoiler((s) => !s);
  };

  const reset = () => {
    setSpoiler(false);
    setChecked({});
    shuffleCountries();
  };

  const handleGuess = (country: Country, _guess: string) => {
    const getLangProps = () => {
      switch (lang) {
        case "pt-br":
          return {
            name: country.name.pt,
            alias: country.alias.pt,
          };
        case "en-us":
        default:
          return {
            name: country.name.en,
            alias: country.alias.en,
          };
      }
    };

    const { name, alias } = getLangProps();

    const normalize = (input: string) =>
      input
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/-/gu, " ")
        .toLowerCase()
        .trim();

    const answers = [name, ...alias].map(normalize);
    const guess = normalize(_guess);

    if (answers.includes(guess)) {
      // Focus next element
      const elements = document.querySelectorAll('[data-country-id][data-checked="false"]');
      const current = document.querySelector(`[data-country-id="${country.id}"]`);
      const index = [...elements].indexOf(current!);
      elements[index === elements.length - 1 ? 0 : index + 1]?.querySelector<HTMLInputElement>("input")?.focus();

      // Set checked
      setChecked((c) => ({ ...c, [country.id]: true }));
    }
  };

  const cards = countries.map((country) => (
    <React.Fragment key={country.id}>
      <CountryCard
        {...country}
        checked={!!checked[country.id] ? "correct" : spoiler ? "spoiler" : false}
        onGuess={(guess) => handleGuess(country, guess)}
        width={large ? 300 : 180}
      />
    </React.Fragment>
  ));

  return (
    <Stack>
      <Box sx={{ position: "sticky", top: 0, zIndex: 2, background: "#fafafa", width: "100%" }} py="xs">
        <Group>
          <Text weight={700}>{props.title}</Text>
          <Box>
            <Text>
              {Object.values(checked).length} / {countries.length}
            </Text>
          </Box>
          <Group ml="auto" spacing="xs">
            <LanguageSelector />
            <Menu shadow="md" width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon radius="xl" color="dark">
                  <RiMore2Fill size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Quiz</Menu.Label>
                <Menu.Item icon={<RiShuffleFill />} onClick={shuffleCountries}>
                  Shuffle
                </Menu.Item>
                <Menu.Item icon={<RiRestartLine />} onClick={reset}>
                  Reset
                </Menu.Item>
                <Menu.Item color="red" icon={spoiler ? <RiEyeCloseLine /> : <RiEyeLine />} onClick={toggleSpoiler}>
                  {spoiler ? "Hide" : "Show"} answers
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item icon={<RiMicLine />} rightSection={<Switch size="xs" />}>
                  Enable speech
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>
      <form>
        {large ? (
          <Group spacing="xs">
            {cards.map((card) => (
              <Box key={card.key} sx={{ width: 300 }}>
                {card}
              </Box>
            ))}
          </Group>
        ) : (
          <Grid columns={2}>
            {cards.map((card) => (
              <Grid.Col span={1} key={card.key}>
                {card}
              </Grid.Col>
            ))}
          </Grid>
        )}
      </form>
    </Stack>
  );
};

const CountryCard: React.FC<
  Country & {
    checked: "correct" | "spoiler" | false;
    onGuess: (guess: string) => void;
    width?: number;
  }
> = (props) => {
  const [lang] = useLocalStorage({ key: "gtf:lang", defaultValue: "en-us" });
  const theme = useMantineTheme();
  const [focused, setFocused] = React.useState(false);

  const getStateProps = () => {
    switch (props.checked) {
      case "correct":
        return {
          color: [theme.colors.green[2], theme.colors.green[9]],
          icon: <RiCheckLine />,
        };
      case "spoiler":
        return {
          color: [theme.colors.red[2], theme.colors.red[9]],
          icon: <RiEyeLine />,
        };
      default:
        return {
          color: [undefined, undefined],
          icon: undefined,
        };
    }
  };

  const getLangProps = () => {
    switch (lang) {
      case "pt-br":
        return {
          name: props.name.pt,
        };
      case "en-us":
      default:
        return {
          name: props.name.en,
        };
    }
  };

  const { color, icon } = getStateProps();
  const { name } = getLangProps();

  // Wrapper
  const Wrapper = props.checked ? "div" : "label";

  return (
    <Wrapper data-country-id={props.id} data-checked={props.checked} style={{ width: "100%" }}>
      <Card
        p="lg"
        radius="md"
        shadow={focused ? "lg" : undefined}
        sx={(t) => ({
          outline: focused ? `1px solid ${t.colors.blue[9]}` : undefined,
        })}
        withBorder
      >
        <Card.Section sx={{ backgroundColor: color[0] }}>
          <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
            <NextImage
              src={props.flag}
              alt={props.checked ? `Flag of ${name}` : "Flag of unknown"}
              title={props.checked ? name : undefined}
              objectFit="contain"
              layout="fill"
            />
          </AspectRatio>
        </Card.Section>
        <Card.Section sx={{ backgroundColor: color[0] }}>
          <Input
            icon={icon}
            value={props.checked ? name : undefined}
            title={props.checked ? name : undefined}
            placeholder="Your guess"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onGuess(e.target.value)}
            readOnly={!!props.checked}
            disabled={!!props.checked}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            styles={{
              icon: {
                color: color[1],
              },
              input: {
                width: `100%`,
                border: "none",
                textOverflow: "ellipsis",
                "&:disabled": {
                  color: color[1],
                  background: "none",
                  border: "none",
                  opacity: 1,
                  cursor: "default",
                },
              },
            }}
          />
        </Card.Section>
      </Card>
    </Wrapper>
  );
};

const Flag = ({ src, width, height }: { src: StaticImageData; width?: string | number; height?: string | number }) => {
  return (
    <AspectRatio ratio={45 / 30} style={{ width, height, borderRadius: 2, overflow: "hidden" }}>
      <NextImage src={src} layout="fill" />
    </AspectRatio>
  );
};

const FlagButton = (props: { selected: boolean; children: React.ReactNode; onClick: () => any }) => {
  return (
    <UnstyledButton
      sx={{
        opacity: props.selected ? 1 : 0.2,
        transition: "opacity 300ms ease",
        cursor: props.selected ? "default" : "pointer",
        "&:hover": {
          opacity: props.selected ? 1 : 0.7,
        },
      }}
      {...props}
    />
  );
};

const LanguageSelector = () => {
  const [lang, setLang] = useLocalStorage({ key: "gtf:lang", defaultValue: "en-us" });

  return (
    <Menu shadow="md" width={200} position="bottom-end" withArrow>
      <Menu.Target>
        <Box sx={(t) => ({ display: "flex", alignItems: "center", gap: 2, color: t.colors.dark[9] })}>
          <RiArrowDownSLine size={16} />
          <Flag src={lang === "pt-br" ? flags.BR : lang === "en-us" ? flags.US : flags.US} width={18} />
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<Flag src={flags.US} width={20} />} onClick={() => setLang("en-us")}>
          English (US)
        </Menu.Item>
        <Menu.Item icon={<Flag src={flags.BR} width={20} />} onClick={() => setLang("pt-br")}>
          Português (BR)
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <Group spacing="xs">
      <FlagButton selected={lang === "en-us"} onClick={() => setLang("en-us")}>
        <Flag src={flags.US} width={25} />
      </FlagButton>

      <FlagButton selected={lang === "pt-br"} onClick={() => setLang("pt-br")}>
        <Flag src={flags.BR} width={25} />
      </FlagButton>
    </Group>
  );
};

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
