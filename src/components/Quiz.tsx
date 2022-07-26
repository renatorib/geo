import React from "react";
import {
  Card,
  Image,
  Text,
  Button,
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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  RiCheckLine,
  RiShuffleFill,
  RiEyeLine,
  RiMore2Fill,
  RiMicLine,
  RiEyeCloseLine,
  RiRestartLine,
} from "react-icons/ri";
import { Country } from "../countries";

export const Quiz = (props: { countries: Country[]; title: string }) => {
  const [, rerender] = React.useState(0);
  const [spoiler, setSpoiler] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [countries, setCountries] = React.useState(() => shuffle(props.countries));
  const large = useMediaQuery("(min-width: 1023px)");

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
    const normalize = (input: string) =>
      input
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/-/gu, " ")
        .toLowerCase()
        .trim();

    const answers = [country.name, ...(country.alias ?? [])].map(normalize);
    const guess = normalize(_guess);

    if (answers.includes(guess)) {
      // Focus next element
      const elements = document.querySelectorAll('[data-country-id][data-checked="false"]');
      const current = document.querySelector(`[data-country-id="${country.id}"]`);
      const index = [...elements].indexOf(current!);
      elements[index === elements.length - 1 ? 0 : index + 1]?.querySelector<HTMLInputElement>("input")?.focus();

      // Set checked
      setChecked((c) => ({ ...c, [country.name]: true }));
    }
  };

  const cards = countries.map((country) => (
    <React.Fragment key={country.id}>
      <CountryCard
        {...country}
        checked={!!checked[country.name] ? "correct" : spoiler ? "spoiler" : false}
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
            <Menu shadow="md" width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon variant="outline" radius="xl">
                  <RiMore2Fill />
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
> = ({ id, name, flag, checked, onGuess }) => {
  const theme = useMantineTheme();
  const [focused, setFocused] = React.useState(false);

  const getStateProps = () => {
    switch (checked) {
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

  const { color, icon } = getStateProps();

  // Wrapper
  const Wrapper = checked ? "div" : "label";

  return (
    <Wrapper data-country-id={id} data-checked={checked} style={{ width: "100%" }}>
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
            <Image
              src={flag.src}
              alt={checked ? `Flag of ${name}` : "Flag of unknown"}
              title={checked ? name : undefined}
            />
          </AspectRatio>
        </Card.Section>
        <Card.Section sx={{ backgroundColor: color[0] }}>
          <Input
            icon={icon}
            value={checked ? name : undefined}
            title={checked ? name : undefined}
            placeholder="Your guess"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onGuess(e.target.value)}
            readOnly={!!checked}
            disabled={!!checked}
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
