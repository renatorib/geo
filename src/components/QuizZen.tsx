import dynamic from "next/dynamic";
import React from "react";

import { Text, Group, Box, Stack, ActionIcon, Menu, Transition, Button } from "@mantine/core";
import {
  RiShuffleFill,
  RiEyeLine,
  RiMore2Fill,
  RiEyeCloseLine,
  RiRestartLine,
  RiSkipForwardFill,
  RiTimerFill,
} from "react-icons/ri";

import { Display } from "~/data-sources";
import { useGuesser, Node, openCongratulationsModal } from "~/features/guesser";
import { useLocalSettings } from "~/features/settings";
import { SpeechAlert, useTranscripter } from "~/features/speech-recognition";
import { TimerControl, useTimer } from "~/features/timer";
import { Entity, Answer } from "~/games";
import { onNextPaint } from "~/lib/dom";

import { ProgressBar } from "./ProgressBar";
import { QuizCard } from "./QuizCard";

type QuizProps<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title: string;
  display?: Display<T>;
};

export const QuizZen = <T extends Entity>(props: QuizProps<T>) => {
  const settings = useLocalSettings();
  const timer = useTimer();

  const guesser = useGuesser({
    initial: props.data,
    answer: props.answer,
    onGuess({ correct, node }) {
      if (!timer.started) timer.start();
      if (correct) selectNextOf(node);
    },
    onComplete() {
      openCongratulationsModal({
        guesses: guesser.data.length,
        name: props.title,
        time: timer.end(),
      });
    },
  });

  const [currentNode, setCurrentNode] = React.useState<Node<T>>(guesser.data[0]);
  const { value: currentNodeValue } = guesser.answer(currentNode);
  const currentNodeStatus = guesser.getNodeStatus(currentNode);

  const transcripter = useTranscripter({
    enabled: settings.speech,
    active: !!currentNode,
    onTranscript: (transcript) => guesser.guess(currentNode, transcript),
  });

  const selectNextOf = (node: Node<T>) => {
    const next = guesser.getNextUnchecked(node);
    if (next) {
      setCurrentNode(next);
      onNextPaint(() => {
        const nextInput = document.querySelector<HTMLInputElement>(`[data-quiz-card-id="${next.entity.id}"] input`);
        nextInput?.focus();
      });
    }
  };

  return (
    <Stack pt="sm">
      <Transition mounted={settings.speech} transition="fade" duration={200}>
        {(styles) => (
          <Box style={{ ...styles }}>
            <SpeechAlert />
          </Box>
        )}
      </Transition>

      <div>
        <Box sx={{ maxWidth: 500, margin: "0 auto" }} py={100}>
          <Box py="xs" mx="-md" px="md">
            <Group spacing="xl">
              <Stack justify="stretch" align="stretch" sx={{ flexGrow: 1 }}>
                <Group spacing="xl">
                  <Text weight={700}>{props.title}</Text>
                  <Box>
                    <Text>
                      {guesser.totalChecked} / {guesser.data.length}
                    </Text>
                  </Box>
                  {settings.timer && <TimerControl timer={timer} />}
                </Group>
                <ProgressBar progress={guesser.totalChecked / guesser.data.length} />
              </Stack>

              <Group ml="auto" spacing="xs">
                <Menu shadow="md" width={200} position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon radius="xl" color="dark">
                      <RiMore2Fill size={20} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<RiShuffleFill />}
                      onClick={() => {
                        guesser.shuffle();
                        setCurrentNode(guesser.data[0]);
                      }}
                    >
                      Shuffle
                    </Menu.Item>
                    <Menu.Item
                      icon={<RiRestartLine />}
                      onClick={() => {
                        guesser.reset();
                        timer.end();
                      }}
                    >
                      Reset
                    </Menu.Item>
                    <Menu.Item icon={<RiTimerFill />} onClick={() => settings.setTimer((v) => !v)}>
                      {settings.timer ? "Hide timer" : "Show timer"}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      icon={guesser.spoiler ? <RiEyeCloseLine /> : <RiEyeLine />}
                      onClick={guesser.toggleSpoiler}
                    >
                      {guesser.spoiler ? "Hide" : "Show"} answers
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Box>

          <QuizCard
            key={currentNode.entity.id}
            id={currentNode.entity.id}
            name={currentNodeValue}
            listening={transcripter.listening}
            status={guesser.getNodeStatus(currentNode)}
            onGuess={(text) => guesser.guess(currentNode, text)}
          >
            {props.display ? props.display({ data: currentNode.entity, status: currentNodeStatus }) : null}
          </QuizCard>

          <Box pt={30} sx={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {guesser.isCompleted ? (
              <Button color="violet" variant="filled" onClick={guesser.reset} leftIcon={<RiRestartLine />}>
                Restart
              </Button>
            ) : (
              <>
                <Button
                  color="red"
                  variant="light"
                  onClick={guesser.toggleSpoiler}
                  leftIcon={guesser.spoiler ? <RiEyeCloseLine /> : <RiEyeLine />}
                >
                  Spoiler
                </Button>
                <Button
                  color="violet"
                  variant="filled"
                  onClick={() => selectNextOf(currentNode)}
                  leftIcon={<RiSkipForwardFill />}
                >
                  Skip
                </Button>
              </>
            )}
          </Box>
        </Box>
      </div>
    </Stack>
  );
};

export const QuizZenNoSSR = dynamic(() => Promise.resolve(QuizZen), { ssr: false });
