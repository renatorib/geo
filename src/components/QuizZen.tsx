import React from "react";

import { Text, Group, Box, Stack, ActionIcon, Menu, Button } from "@mantine/core";
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
import { useGuesser, openCongratulationsModal } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { TimerControl, useTimer } from "~/features/timer";
import { Entity, Answer } from "~/games";

import { ProgressBar } from "./ProgressBar";
import { QuizCard } from "./QuizCard";

type QuizProps<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title: string;
  display?: Display<T>;
};

export const QuizZen = <T extends Entity>(props: QuizProps<T>) => {
  const settings = useSettings();
  const timer = useTimer();

  const guesser = useGuesser({
    initial: props.data,
    answer: props.answer,
    onGuess({ correct }) {
      if (!timer.started) timer.start();
      if (correct) guesser.selectNextNode();
    },
    onComplete() {
      openCongratulationsModal({
        guesses: guesser.data.length,
        name: props.title,
        time: timer.end(),
      });
    },
  });

  const { value: currentNodeValue } = guesser.answer(guesser.selectedNode);
  const currentNodeStatus = guesser.getNodeStatus(guesser.selectedNode);

  return (
    <Box pt="sm" sx={{ width: "100%", position: "relative" }}>
      <Box sx={{ maxWidth: 500, margin: "0 auto", display: "grid", placeItems: "center" }}>
        <Box py="xs" sx={{ width: "100%" }}>
          <Stack justify="stretch" align="stretch" sx={{ flexGrow: 1 }}>
            <Group spacing="xl">
              <Group spacing="xl">
                <Text weight={700}>{props.title}</Text>
                <Box>
                  <Text>
                    {guesser.totalChecked} / {guesser.data.length}
                  </Text>
                </Box>
                {settings.timer && <TimerControl timer={timer} />}
              </Group>

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
            <Box>
              <ProgressBar progress={guesser.totalChecked / guesser.data.length} />
            </Box>
          </Stack>
        </Box>

        <QuizCard
          key={guesser.selectedNode.id}
          id={guesser.selectedNode.id}
          name={currentNodeValue}
          // listening={transcripter.listening}
          status={guesser.getNodeStatus(guesser.selectedNode)}
          onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
        >
          {props.display ? props.display({ data: guesser.selectedNode.entity, status: currentNodeStatus }) : null}
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
                variant="outline"
                onClick={guesser.toggleSpoiler}
                leftIcon={guesser.spoiler ? <RiEyeCloseLine /> : <RiEyeLine />}
              >
                Spoiler
              </Button>
              <Button
                color="violet"
                variant="filled"
                onClick={() => guesser.selectNextNode()}
                leftIcon={<RiSkipForwardFill />}
              >
                Skip
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
