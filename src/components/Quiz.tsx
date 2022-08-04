import React from "react";
import dynamic from "next/dynamic";
import Confetti from "react-confetti";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { openModal } from "@mantine/modals";
import {
  Card,
  Text,
  Group,
  Input,
  Box,
  Stack,
  useMantineTheme,
  Grid,
  ActionIcon,
  Menu,
  Alert,
  Transition,
  Center,
  Portal,
} from "@mantine/core";
import {
  RiCheckLine,
  RiShuffleFill,
  RiEyeLine,
  RiMore2Fill,
  RiMicLine,
  RiEyeCloseLine,
  RiRestartLine,
  RiSettings2Line,
  RiPlayCircleFill,
} from "react-icons/ri";
import { Country } from "../countries";
import { useEvent, useLang, usePooling, useUserConfig } from "~/hooks";
import { blink, pop } from "~/styles/keyframes";
import { normalizeGuess } from "~/modules/string";
import { GiPartyPopper } from "react-icons/gi";

type QuizProps = {
  type?: "country" | "capital";
  countries: Country[];
  title: string;
  display?: ({ country, checked }: { country: Country; checked: "correct" | "spoiler" | false }) => JSX.Element;
};

export const Quiz = (props: QuizProps) => {
  const [, rerender] = React.useState(0);
  const { speech, timer } = useUserConfig();
  const { transcript, listening, isMicrophoneAvailable, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [spoiler, setSpoiler] = React.useState(false);
  const [focusedCountryId, setFocusedCountryId] = React.useState<string>();
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [countries, setCountries] = React.useState<Country[]>(() => shuffle(props.countries));
  const { lang, property } = useLang();
  const timerProps = useTimer();
  const type = props.type ?? "country";

  const useSpeech = browserSupportsSpeechRecognition && isMicrophoneAvailable && speech;

  React.useEffect(() => {
    const SpeechGrammarList =
      (window as any).SpeechGrammarList ||
      (window as any).webkitSpeechGrammarList ||
      (window as any).mozSpeechGrammarList ||
      (window as any).webkitSpeechGrammarList;

    if (useSpeech && SpeechGrammarList) {
      const recognition = SpeechRecognition.getRecognition() as any;

      if ("grammars" in recognition) {
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

  const handleGuess = (country: Country, guess: string) => {
    if (!timerProps.started) {
      timerProps.start();
    }

    const answers = (
      type === "capital"
        ? [country.capital[property], ...country.capitalAlias[property]]
        : [country.name[property], ...country.alias[property]]
    ).map(normalizeGuess);

    if (answers.includes(normalizeGuess(guess))) {
      const elements = document.querySelectorAll('[data-quiz-card-id][data-quiz-card-status="false"]');
      const current = document.querySelector(`[data-quiz-card-id="${country.id}"]`);
      const index = [...elements].indexOf(current!);

      const currInput = current?.querySelector<HTMLInputElement>("input");
      const nextInput =
        elements[index === elements.length - 1 ? 0 : index + 1]?.querySelector<HTMLInputElement>("input");

      currInput?.blur();
      setChecked((c) => ({ ...c, [country.id]: true }));
      setTimeout(() => {
        nextInput?.focus();
      }, 1);

      // Completed
      if (Object.keys(checked).length + 1 === countries.length) {
        // Show congratulations modal
        const time = timerProps.end();
        window.scrollTo({ top: 0, behavior: "smooth" });
        openModal({
          size: "xs",
          overlayColor: "rgba(200, 200, 200, 0.7)",
          overlayBlur: 2,
          centered: true,
          withCloseButton: false,
          children: (
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 10 }}>
              <Portal>
                <Confetti />
              </Portal>
              <Text color="violet" sx={{ animation: `${pop} 500ms ease-in` }}>
                <GiPartyPopper size={120} />
              </Text>
              <Text color="dark" align="center">
                <>
                  <strong>Congratulations!</strong>
                  <br />
                  You have completed {countries.length} guesses of {props.title} in <strong>{time}</strong>
                </>
              </Text>
            </Box>
          ),
        });
      }
    }
  };

  const cards = countries.map((country) => {
    const isChecked = !!checked[country.id] ? "correct" : spoiler ? "spoiler" : false;
    const displayEl = props.display ? props.display({ country, checked: isChecked }) : null;
    const name = type === "capital" ? country.capital[property] : country.name[property];

    return (
      <React.Fragment key={country.id}>
        <div
          onFocusCapture={() => setFocusedCountryId(country.id)}
          onBlurCapture={() => setFocusedCountryId((c) => (c === country.id ? undefined : c))}
        >
          <GuessCard
            id={country.id}
            name={name}
            display={displayEl}
            listening={listening}
            checked={isChecked}
            onGuess={(guess) => handleGuess(country, guess)}
          />
        </div>
      </React.Fragment>
    );
  });

  return (
    <Stack pt="sm">
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "#ffffff",
        }}
        py="xs"
        mx="-md"
        px="md"
      >
        <Group spacing="xl">
          <Text weight={700}>{props.title}</Text>
          <Box>
            <Text>
              {Object.values(checked).length} / {countries.length}
            </Text>
          </Box>
          {timer && (
            <Box style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Text color={timerProps.started ? "orange" : "gray"} weight={700}>
                <Timer started={timerProps.started} />
              </Text>
              {!timerProps.started && (
                <ActionIcon
                  onClick={() => timerProps.start()}
                  color="green"
                  radius="xl"
                  variant="subtle"
                  size="md"
                  style={{ marginTop: -2 }}
                >
                  <RiPlayCircleFill size={20} />
                </ActionIcon>
              )}
            </Box>
          )}

          <Group ml="auto" spacing="xs">
            <Menu shadow="md" width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon radius="xl" color="dark">
                  <RiMore2Fill size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<RiShuffleFill />} onClick={shuffleCountries}>
                  Shuffle
                </Menu.Item>
                <Menu.Item icon={<RiRestartLine />} onClick={reset}>
                  Reset
                </Menu.Item>
                <Menu.Item color="red" icon={spoiler ? <RiEyeCloseLine /> : <RiEyeLine />} onClick={toggleSpoiler}>
                  {spoiler ? "Hide" : "Show"} answers
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>

      <Transition mounted={speech} transition="fade" duration={200}>
        {(styles) => (
          <Box style={{ ...styles }}>
            <Alert color="indigo" title="Speech is enabled!" icon={<RiMicLine />}>
              <Text color="dimmed">
                When you see <RiMicLine color="red" style={{ verticalAlign: "middle" }} /> icon, it means we are
                listening to your guesses through your microphone. <br /> You can disable speech mode in your settings{" "}
                <RiSettings2Line color="black" style={{ verticalAlign: "middle" }} /> located at top-right of the
                header.
              </Text>
            </Alert>
          </Box>
        )}
      </Transition>

      <form>
        <Grid>
          {cards.map((card) => (
            <Grid.Col span={6} md={4} key={card.key}>
              {card}
            </Grid.Col>
          ))}
        </Grid>
      </form>
    </Stack>
  );
};

export const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

type GuessCardProps = {
  id: string;
  name: string;
  checked: "correct" | "spoiler" | false;
  onGuess: (guess: string) => void;
  listening?: boolean;
  display?: React.ReactNode;
};

const GuessCard = ({ id, name, checked, onGuess, listening, display }: GuessCardProps) => {
  const theme = useMantineTheme();
  const [focused, setFocused] = React.useState(false);

  const color = checked === "correct" ? theme.colors.green : checked === "spoiler" ? theme.colors.red : [];
  const icon =
    checked === "correct" ? (
      <RiCheckLine />
    ) : checked === "spoiler" ? (
      <RiEyeLine />
    ) : listening && focused ? (
      <MicOn />
    ) : null;

  return (
    <Box
      component={checked ? "div" : "label"}
      data-quiz-card-id={id}
      data-quiz-card-status={String(checked)}
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
        {display && <Card.Section sx={{ backgroundColor: color[2] }}>{display}</Card.Section>}

        <Card.Section sx={{ backgroundColor: color[2] }}>
          <Input<"input">
            icon={listening && focused ? <MicOn /> : icon}
            value={checked ? name : undefined}
            title={checked ? name : undefined}
            placeholder="Type your guess..."
            onChange={(e) => onGuess(e.target.value)}
            readOnly={!!checked}
            disabled={!!checked}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            styles={{
              icon: {
                color: color[9],
              },
              input: {
                width: `100%`,
                border: "none",
                textOverflow: "ellipsis",
                "&:disabled": {
                  color: color[9],
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

const MicOn = () => {
  return (
    <Box sx={{ animation: `${blink} 1.5s ease-in-out infinite`, display: "inline-flex" }}>
      <RiMicLine color="red" />
    </Box>
  );
};

const timeDiff = (started: number, now: number) => {
  const diff = (Date.now() - started) / 1000;
  const H = 3600;
  const M = 60;
  const S = 1;

  const hours = Math.floor(diff / H);
  const minutes = Math.floor((diff % H) / M);
  const seconds = Math.floor(((diff % H) % M) / S);

  const hoursText = String(hours).padStart(2, "0");
  const minutesText = String(minutes).padStart(2, "0");
  const secondsText = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hoursText}:${minutesText}:${secondsText}`;
  }
  return `${minutesText}:${secondsText}`;
};

const useTimer = () => {
  const [started, setStarted] = React.useState<number>();

  const start = () => {
    setStarted(Date.now());
  };

  const end = () => {
    setStarted(undefined);
    return started ? timeDiff(started, Date.now()) : "00";
  };

  return { start, end, started };
};

const Timer = ({ started }: { started: number | undefined }) => {
  const [time, setTime] = React.useState("");

  const tick = useEvent(() => {
    if (started) {
      setTime(timeDiff(started, Date.now()));
    }
  });

  React.useEffect(() => void tick(), [started]); // eslint-disable-line
  usePooling(() => tick(), 400);

  return <>{time}</>;
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
