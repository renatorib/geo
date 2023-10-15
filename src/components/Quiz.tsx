import React from "react";

import { Text, Group, Box, Stack, Grid, ActionIcon, Menu } from "@mantine/core";
import { RiShuffleFill, RiEyeLine, RiMore2Fill, RiEyeCloseLine, RiRestartLine } from "react-icons/ri";

import { Display } from "~/data-sources";
import { openCongratulationsModal, useGuesser } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { TimerControl, useTimer } from "~/features/timer";
import { Entity, Answer } from "~/games";
import { onNextPaint } from "~/lib/dom";

import { QuizCard } from "./QuizCard";

type QuizProps<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title: string;
  display?: Display<T>;
};

export const Quiz = <T extends Entity>(props: QuizProps<T>) => {
  const settings = useSettings();
  const timer = useTimer();

  const guesser = useGuesser({
    initial: props.data,
    answer: props.answer,
    onGuess({ correct, node }) {
      if (!timer.started) timer.start();
      if (correct) selectNextOf(node.entity);
    },
    onComplete() {
      openCongratulationsModal({
        guesses: guesser.data.length,
        name: props.title,
        time: timer.end(),
      });
    },
  });

  const selectNextOf = (entity: T) => {
    const currentIndex = guesser.data.findIndex((node) => node.entity.id === entity.id);
    const lookup = [
      ...guesser.data.slice(currentIndex + 1, guesser.data.length),
      ...guesser.data.slice(0, currentIndex + 1),
    ];
    const next = lookup.find((node) => node.checked === false);

    const currInput = document.querySelector<HTMLInputElement>(`[data-quiz-card-id="${entity.id}"] input`);
    const nextInput = document.querySelector<HTMLInputElement>(`[data-quiz-card-id="${next?.id}"] input`);

    currInput?.blur();
    onNextPaint(() => nextInput?.focus());
  };

  return (
    <Stack pt="sm">
      <Box
        py="xs"
        mx="-md"
        px="md"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "#ffffff",
        }}
      >
        <Group spacing="xl">
          <Text weight={700}>{props.title}</Text>
          <Box>
            <Text>
              {guesser.totalChecked} / {guesser.data.length}
            </Text>
          </Box>

          {settings.timer && <TimerControl timer={timer} />}

          <Group ml="auto" spacing="xs">
            <Menu shadow="md" width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon radius="xl" color="dark">
                  <RiMore2Fill size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<RiShuffleFill />} onClick={guesser.shuffle}>
                  Shuffle
                </Menu.Item>
                <Menu.Item icon={<RiRestartLine />} onClick={guesser.reset}>
                  Reset
                </Menu.Item>
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

      <form>
        <Grid>
          {guesser.data.map((node) => {
            const { value } = guesser.answer(node);
            const status = guesser.getNodeStatus(node);

            return (
              <Grid.Col span={6} md={4} key={node.id}>
                <div>
                  <QuizCard
                    id={node.entity.id}
                    name={value}
                    status={status}
                    onGuess={(text) => guesser.guess(node, text)}
                  >
                    {props.display ? props.display({ data: node.entity, status }) : null}
                  </QuizCard>
                </div>
              </Grid.Col>
            );
          })}
        </Grid>
      </form>
    </Stack>
  );
};
