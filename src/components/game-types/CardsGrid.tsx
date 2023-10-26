import React from "react";

import { Text, Group, Box, Stack, Grid, ActionIcon, Menu } from "@mantine/core";
import { RiShuffleFill, RiEyeLine, RiMore2Fill, RiEyeCloseLine, RiRestartLine } from "react-icons/ri";

import { Display } from "~/data-sources";
import { useGuesser } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { TimerControl } from "~/features/timer";
import { Entity, Answer } from "~/games";

import { QuizCard } from "../QuizCard";

type CardsProps<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title: string;
  display?: Display<T>;
};

export const CardsGrid = <T extends Entity>(props: CardsProps<T>) => {
  const settings = useSettings();

  const guesser = useGuesser({
    data: props.data,
    answer: props.answer,
    title: props.title,
  });

  return (
    <Stack pt="sm">
      <Box
        py="xs"
        mx="-md"
        px="md"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "#ffffff",
        }}
      >
        <Group gap="xl">
          <Text fw={700}>{props.title}</Text>
          <Box>
            <Text>
              {guesser.totalChecked} / {guesser.data.length}
            </Text>
          </Box>

          {settings.timer && <TimerControl timer={guesser.timer} />}

          <Group ml="auto" gap="xs">
            <Menu shadow="md" width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon radius="xl" variant="default">
                  <RiMore2Fill size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<RiShuffleFill />} onClick={guesser.shuffle}>
                  Shuffle
                </Menu.Item>
                <Menu.Item leftSection={<RiRestartLine />} onClick={guesser.reset}>
                  Reset
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={guesser.spoiler ? <RiEyeCloseLine /> : <RiEyeLine />}
                  onClick={guesser.toggleSpoiler}
                >
                  {guesser.spoiler ? "Hide" : "Show"} answers
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>

      <Grid>
        {guesser.data.map((node) => {
          const { value } = guesser.answer(node);
          const status = guesser.getNodeStatus(node);

          return (
            <Grid.Col key={node.id} span={{ base: 6, md: 4 }}>
              <QuizCard
                id={node.entity.id}
                name={value}
                status={status}
                onGuess={(text) => guesser.guess(node, text)}
                onFocus={() => guesser.setSelectedNode(node)}
              >
                {props.display ? props.display({ data: node.entity, status }) : null}
              </QuizCard>
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
};
