import React from "react";
import NextImage, { StaticImageData } from "next/image";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLang } from "~/hooks";
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
  Alert,
  Transition,
  Center,
} from "@mantine/core";
import { useInterval, useLocalStorage, useMediaQuery } from "@mantine/hooks";
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
import { useEvent } from "~/hooks/useEvent";
import { calcViewBox } from "~/modules/svg/calcViewBox";

type QuizProps = {
  type?: "flag" | "shape";
  countries: Country[];
  title: string;
};

export const Quiz = (props: QuizProps) => {
  const [, rerender] = React.useState(0);
  const { lang } = useLang();
  const [speech, setSpeech] = useLocalStorage({ key: "gtf:speech", defaultValue: "false" });
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
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
        case "pt-BR":
          return {
            name: country.name.pt,
            alias: country.alias.pt,
          };
        case "en-US":
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
      const elements = document.querySelectorAll('[data-quiz-card-id][data-quiz-card-status="false"]');
      const current = document.querySelector(`[data-quiz-card-id="${country.id}"]`);
      const index = [...elements].indexOf(current!);

      const currInput = current?.querySelector<HTMLInputElement>("input");
      const nextInput =
        elements[index === elements.length - 1 ? 0 : index + 1]?.querySelector<HTMLInputElement>("input");

      currInput?.blur();

      // Set checked
      setChecked((c) => ({ ...c, [country.id]: true }));

      // Focus next element
      setTimeout(() => nextInput?.focus(), 1);
    }
  };

  const cards = countries.map((country) => (
    <React.Fragment key={country.id}>
      <CountryCard
        {...country}
        checked={!!checked[country.id] ? "correct" : spoiler ? "spoiler" : false}
        onGuess={(guess) => handleGuess(country, guess)}
        width={large ? 300 : 180}
        type={props.type ?? "flag"}
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
                <Group px={12} py={6} position="apart">
                  <Switch
                    size="xs"
                    checked={speech === "true" ? true : false}
                    onChange={(ev) => setSpeech(String(ev.currentTarget.checked))}
                    disabled={!browserSupportsSpeechRecognition}
                    label={`Enable speech ${!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}`}
                  />
                </Group>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>
      <Transition mounted={speech === "true"} transition="fade" duration={200}>
        {(styles) => (
          <Box style={{ ...styles }}>
            <Alert variant="outline" title="Speech is enabled!" icon={<RiMicLine />}>
              <Text color="dimmed">
                The <RiMicLine color="red" style={{ verticalAlign: "middle" }} /> icon means that we are listening to
                your guesses through your mic.
                <br />
                If you are focusing a card but not see the icon, you can{" "}
                <strong>{large ? "press enter" : "touch the card again"}</strong> to turn it on again.
                <br />
                Remember you can always disable <em>speech guesses</em> in your settings{" "}
                <RiMore2Fill style={{ verticalAlign: "middle" }} />.
              </Text>
            </Alert>
          </Box>
        )}
      </Transition>
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
    type: "flag" | "shape";
    checked: "correct" | "spoiler" | false;
    onGuess: (guess: string) => void;
    width?: number;
  }
> = (props) => {
  const { lang } = useLang();
  const [speech] = useLocalStorage({ key: "gtf:speech", defaultValue: "false" });
  const { interimTranscript, listening, isMicrophoneAvailable, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [focused, setFocused] = React.useState(false);
  const theme = useMantineTheme();
  const type = props.type ?? "flag";

  const shapeViewbox = React.useMemo(() => {
    return type === "shape" && props.shape ? calcViewBox(props.shape) : null;
  }, [type, props.shape]);

  const useSpeech = browserSupportsSpeechRecognition && isMicrophoneAvailable && speech === "true";

  const startListening = () => {
    if (useSpeech && !listening) {
      SpeechRecognition.startListening({ language: lang, continuous: true });
    }
  };

  const stopListening = () => {
    if (useSpeech || listening) {
      SpeechRecognition.stopListening();
    }
  };

  const tick = useEvent(() => {
    if (useSpeech && focused && !listening) {
      startListening();
    }
  });

  const interval = useInterval(tick, 1000);

  React.useEffect(() => {
    interval.start();
    return interval.stop;
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (useSpeech && interimTranscript && focused) {
      console.log(interimTranscript);
      props.onGuess(interimTranscript);
    }
  }, [interimTranscript, focused, useSpeech]); // eslint-disable-line

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
      case "pt-BR":
        return {
          name: props.name.pt,
        };
      case "en-US":
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
    <Wrapper data-quiz-card-id={props.id} data-quiz-card-status={props.checked} style={{ width: "100%" }}>
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
          {type === "flag" && (
            <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
              <NextImage
                src={props.flag}
                alt={props.checked ? `Flag of ${name}` : "Flag of unknown"}
                title={props.checked ? name : undefined}
                objectFit="contain"
                layout="fill"
              />
            </AspectRatio>
          )}
          {type === "shape" && (
            <Box>
              {props.shape && shapeViewbox ? (
                <svg viewBox={shapeViewbox} width="100%" height="100%">
                  <path d={props.shape} fill={props.checked ? color[1] : "#222"} />
                </svg>
              ) : (
                <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
                  <Center>
                    <Text color="red" size="xs">
                      Country shape not found
                    </Text>
                  </Center>
                </AspectRatio>
              )}
            </Box>
          )}
        </Card.Section>
        <Card.Section sx={{ backgroundColor: color[0] }}>
          <Input
            icon={listening && focused ? <RiMicLine color="red" /> : icon}
            value={props.checked ? name : undefined}
            title={props.checked ? name : undefined}
            placeholder="Your guess"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onGuess(e.target.value)}
            readOnly={!!props.checked}
            disabled={!!props.checked}
            onFocus={() => {
              setFocused(true);
              startListening();
            }}
            onBlur={() => {
              setFocused(false);
              stopListening();
            }}
            onKeyPress={(ev: React.KeyboardEvent) => {
              if (ev.code === "Enter") {
                startListening();
              }
            }}
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

const LanguageSelector = () => {
  const { lang, setLang, langs } = useLang();

  return (
    <Menu shadow="md" width={200} position="bottom-end" withArrow>
      <Menu.Target>
        <UnstyledButton sx={(t) => ({ display: "flex", alignItems: "center", gap: 2, color: t.colors.dark[9] })}>
          <RiArrowDownSLine size={16} />
          <Flag src={langs[lang].flag} width={18} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {Object.values(langs).map((l) => {
          return (
            <Menu.Item key={l.code} icon={<Flag src={l.flag} width={20} />} onClick={() => setLang(l.code)}>
              {l.name}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
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
