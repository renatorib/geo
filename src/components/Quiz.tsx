import React from "react";
import NextImage from "next/image";
import dynamic from "next/dynamic";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
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
  Alert,
  Transition,
  Center,
  Dialog,
  keyframes,
  createStyles,
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
  RiVolumeUpLine,
} from "react-icons/ri";
import { Country } from "../countries";
import { useLang, usePrevious, usePooling } from "~/hooks";
import { calcViewBox } from "~/modules/svg/calcViewBox";
import { LangSelector } from "./LangSelector";
import { zoomIntoPath } from "~/modules/svg/viewbox";

type QuizProps = {
  type?: "flag" | "shape";
  countries: Country[];
  title: string;
};

export const Quiz = (props: QuizProps) => {
  const [, rerender] = React.useState(0);
  const { lang } = useLang();
  const [speech, setSpeech] = useLocalStorage({ key: "gtf:speech", defaultValue: "false" });
  const { transcript, listening, isMicrophoneAvailable, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const large = useMediaQuery("(min-width: 1023px)");
  const [spoiler, setSpoiler] = React.useState(false);
  const [focusedCountryId, setFocusedCountryId] = React.useState<string>();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [countries, setCountries] = React.useState<Country[]>(() => shuffle(props.countries));

  const useSpeech = browserSupportsSpeechRecognition && isMicrophoneAvailable && speech === "true";

  React.useEffect(() => {
    const SpeechGrammarList =
      (window as any).SpeechGrammarList ||
      (window as any).webkitSpeechGrammarList ||
      (window as any).mozSpeechGrammarList ||
      (window as any).webkitSpeechGrammarList;

    if (useSpeech && SpeechGrammarList) {
      const recognition = SpeechRecognition.getRecognition() as any;

      if ("grammars" in recognition) {
        const property = lang === "en-US" ? "en" : lang === "pt-BR" ? "pt" : "en";
        const grammar = `#JSGF V1.0; grammar countries; public <countries> = ${countries
          .flatMap((c) => [c.name[property], ...c.alias[property]])
          .join(" | ")} ;`;
        const list = new SpeechGrammarList();
        list?.addFromString?.(grammar, 10);
        recognition.grammars = list;
      }
    }
  }, [useSpeech, lang]); // eslint-disable-line

  const startListening = () => {
    if (useSpeech && !listening) {
      SpeechRecognition.startListening({ language: lang });
      console.log(SpeechRecognition.getRecognition());
    }
  };

  const stopListening = () => {
    if (useSpeech || listening) {
      SpeechRecognition.stopListening();
    }
  };

  usePooling(() => {
    if (useSpeech && focusedCountryId && !listening) {
      startListening();
    } else if (useSpeech && listening && !focusedCountryId) {
      stopListening();
    }
  }, 100);

  React.useEffect(() => {
    const country = countries.find((c) => c.id === focusedCountryId);
    if (useSpeech && transcript && focusedCountryId && country) {
      handleGuess(country, transcript);
    }
  }, [transcript, focusedCountryId, useSpeech]); // eslint-disable-line

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
      <div
        onFocusCapture={() => setFocusedCountryId(country.id)}
        onBlurCapture={() => setFocusedCountryId((c) => (c === country.id ? undefined : c))}
      >
        <CountryCard
          country={country}
          listening={listening}
          checked={!!checked[country.id] ? "correct" : spoiler ? "spoiler" : false}
          onGuess={(guess) => handleGuess(country, guess)}
          width={large ? 300 : 180}
          type={props.type ?? "flag"}
        />
      </div>
    </React.Fragment>
  ));

  return (
    <>
      <TranscriptDialog />
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
              <LangSelector />
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
                  When you see <RiMicLine color="red" style={{ verticalAlign: "middle" }} /> icon, it means we are
                  listening to your guesses through your microphone. You can disable speech mode in your settings{" "}
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
    </>
  );
};

export const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const CountryCard: React.FC<{
  country: Country;
  checked: "correct" | "spoiler" | false;
  onGuess: (guess: string) => void;
  type?: "flag" | "shape";
  width?: number;
  listening?: boolean;
}> = (props) => {
  const [focused, setFocused] = React.useState(false);
  const { lang } = useLang();
  const theme = useMantineTheme();
  const { country, type = "flag" } = props;

  const shapeViewbox = React.useMemo(() => {
    if (type === "shape") {
      const zoom = zoomIntoPath(country.shape);
      const size = Math.max(zoom.viewboxWidth, zoom.viewboxHeight);
      return { viewbox: zoom.viewbox, size: size };
    }
    return { viewbox: "0 0 1010 666", size: 1000 };
  }, [type, country.shape]);

  const stateProps = React.useMemo(() => {
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
  }, [props.checked]); // eslint-disable-line

  const langProps = React.useMemo(() => {
    switch (lang) {
      case "pt-BR":
        return {
          name: country.name.pt,
        };
      case "en-US":
      default:
        return {
          name: country.name.en,
        };
    }
  }, [lang]); // eslint-disable-line

  const { color, icon } = stateProps;
  const { name } = langProps;

  return (
    <Box
      component={props.checked ? "div" : "label"}
      data-quiz-card-id={country.id}
      data-quiz-card-status={props.checked}
      style={{ width: "100%" }}
    >
      <Card
        withBorder
        p="lg"
        radius="md"
        shadow={focused ? "lg" : undefined}
        sx={(t) => ({
          outline: focused ? `1px solid ${t.colors.blue[9]}` : undefined,
        })}
      >
        <Card.Section sx={{ backgroundColor: color[0] }}>
          {type === "flag" && (
            <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
              {country.flag ? (
                <NextImage
                  src={country.flag}
                  alt={props.checked ? `Flag of ${name}` : "Flag of unknown"}
                  title={props.checked ? name : undefined}
                  objectFit="contain"
                  layout="fill"
                />
              ) : (
                <Center>
                  <Text color="red" size="xs">
                    Flag not found
                  </Text>
                </Center>
              )}
            </AspectRatio>
          )}
          {type === "shape" && (
            <Box>
              {country.shape && shapeViewbox.viewbox ? (
                <svg viewBox={shapeViewbox.viewbox} width="100%" height="100%">
                  <path
                    d={country.shape}
                    stroke={props.checked ? theme.colors.green[7] : theme.colors.gray[5]}
                    fill={props.checked ? theme.colors.green[4] : theme.colors.gray[3]}
                    strokeWidth={shapeViewbox.size * 0.006}
                  />
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
          <Input<"input">
            icon={props.listening && focused ? <MicOn /> : icon}
            value={props.checked ? name : undefined}
            title={props.checked ? name : undefined}
            placeholder="Type your guess..."
            onChange={(e) => props.onGuess(e.target.value)}
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
    </Box>
  );
};

const TranscriptDialog = () => {
  const [show, setShow] = React.useState(false);
  const { transcript } = useSpeechRecognition();
  const prevTranscript = usePrevious(transcript);
  const dismissTimeout = React.useRef<NodeJS.Timeout>();
  const message = transcript || prevTranscript;

  React.useEffect(() => {
    setShow(true);
    clearTimeout(dismissTimeout.current);
    dismissTimeout.current = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(dismissTimeout.current);
  }, [transcript]);

  return (
    <Dialog
      opened={show && !!message}
      position={{ top: 20, left: "calc(50vw - 150px)" }}
      transition="slide-down"
      styles={{
        root: {
          width: 300,
          textAlign: "center",
          boxShadow: "none",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
        <RiVolumeUpLine style={{ flexShrink: "0" }} />
        <Text size="lg">{message}</Text>
      </Box>
    </Dialog>
  );
};

const blink = keyframes({
  "0, 100&": { opacity: 1 },
  "50%": { opacity: 0.2 },
});

const useBlinkStyles = createStyles((theme) => ({
  blink: {
    animation: `${blink} 1.5s ease-in-out infinite`,
  },
}));

const MicOn = () => {
  const { classes } = useBlinkStyles();
  return <RiMicLine color="red" className={classes.blink} />;
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
