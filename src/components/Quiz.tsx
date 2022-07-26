import React from "react";
import { Card, Image, Text, Button, Group, Input, Box, AspectRatio, Stack, useMantineTheme } from "@mantine/core";
import { RiQuestionMark, RiCheckLine, RiShuffleFill, RiEyeLine } from "react-icons/ri";
import { Country } from "../countries";

export const Quiz = (props: { countries: Country[]; title: string }) => {
  const [, rerender] = React.useState(0);
  const [spoiler, setSpoiler] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [countries, setCountries] = React.useState(() => shuffle(props.countries));

  const shuffleCountries = () => {
    setCountries((c) => shuffle(c));
    rerender((r) => r + 1);
  };

  const handleGuess = (country: Country, _guess: string) => {
    const normalize = (input: string) =>
      input
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/-/gu, " ")
        .toLowerCase();

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

  return (
    <Stack>
      <Box sx={{ position: "sticky", top: 0, zIndex: 2, background: "#fafafa" }} py="xs">
        <Group>
          <Text weight={700}>{props.title}</Text>
          <Box>
            <Text>
              {Object.values(checked).length} / {countries.length}
            </Text>
          </Box>
          <Group ml="auto" spacing="xs">
            <Button onClick={shuffleCountries} size="xs" variant="filled" leftIcon={<RiShuffleFill />}>
              Shuffle
            </Button>
            <Button
              onClick={() => setSpoiler((s) => !s)}
              size="xs"
              variant={spoiler ? "filled" : "outline"}
              color="red"
              leftIcon={<RiEyeLine />}
            >
              {spoiler ? "Hide" : "Show"} answers
            </Button>
          </Group>
        </Group>
      </Box>
      <form>
        <Group>
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              {...country}
              checked={!!checked[country.name] ? "correct" : spoiler ? "spoiler" : false}
              onGuess={(guess) => handleGuess(country, guess)}
            />
          ))}
        </Group>
      </form>
    </Stack>
  );
};

const CountryCard: React.FC<
  Country & {
    checked: "correct" | "spoiler" | false;
    onGuess: (guess: string) => void;
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
    <Wrapper data-country-id={id} data-checked={checked}>
      <Card
        p="lg"
        radius="md"
        shadow={focused ? "lg" : undefined}
        sx={(t) => ({
          outline: focused ? `1px solid ${t.colors.blue[9]}` : undefined,
        })}
        withBorder
      >
        <Card.Section sx={{ backgroundColor: checked ? color[0] : "#f2f2f2" }}>
          <AspectRatio ratio={45 / 30} style={{ width: 260 }}>
            <Image
              src={flag.src}
              width={260}
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
