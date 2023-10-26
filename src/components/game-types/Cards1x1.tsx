import React from "react";

import { Text, Group, Box, Stack, ActionIcon, Menu, Button } from "@mantine/core";
import { RiCheckDoubleFill, RiMore2Fill, RiRestartLine, RiSkipForwardFill, RiTimerFill } from "react-icons/ri";

import { Display } from "~/data-sources";
import { useGuesser } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { playSound } from "~/features/sounds";
import { TimerControl } from "~/features/timer";
import { Entity, Answer } from "~/games";
// import trophyImage from "~/images/trophy.png";

import { ProgressBar } from "../ProgressBar";
import { QuizInput } from "../QuizInput";

type Cards1x1Props<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title: string;
  display?: Display<T>;
};

export const Cards1x1 = <T extends Entity>(props: Cards1x1Props<T>) => {
  const settings = useSettings();

  const guesser = useGuesser({
    data: props.data,
    answer: props.answer,
    title: props.title,
    refocus: false,
    onCorrectGuess(node) {
      QuizInput.clearInputById(node.id);
    },
  });

  return (
    <Box style={{ maxWidth: 500, width: "100%", display: "grid", placeItems: "center", margin: "0 auto" }}>
      <Box style={{ width: "100%" }}>
        <Box py="xs" style={{ width: "100%" }}>
          <Stack justify="stretch" align="stretch" style={{ flexGrow: 1 }}>
            <Group gap="xl">
              <Group gap="xl">
                <Text fw={700}>{props.title}</Text>
                <Box>
                  <Text>
                    {guesser.totalChecked} / {guesser.data.length}
                  </Text>
                </Box>
                {settings.timer && <TimerControl timer={guesser.timer} />}
              </Group>

              <Group ml="auto" gap="xs">
                <Menu shadow="md" width={200} position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon radius="xl" variant="default">
                      <RiMore2Fill size={20} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item leftSection={<RiRestartLine />} onClick={() => guesser.reset()}>
                      Reset
                    </Menu.Item>
                    <Menu.Item leftSection={<RiTimerFill />} onClick={() => settings.setTimer((v) => !v)}>
                      {settings.timer ? "Hide timer" : "Show timer"}
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

        <Box pos="relative">
          <>
            <Box key={guesser.selectedNode.id}>
              {props.display
                ? props.display({
                    data: guesser.selectedNode.entity,
                    status: guesser.getNodeStatus(guesser.selectedNode),
                  })
                : null}
            </Box>

            <Box className="shadow-lg rounded-md px-2 py-1 mt-2">
              <QuizInput
                // key={guesser.selectedNode.id}
                id={guesser.selectedNode.id}
                name={guesser.answer(guesser.selectedNode).value}
                status={guesser.getNodeStatus(guesser.selectedNode)}
                onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
                disabled={guesser.isCompleted}
              />
            </Box>
          </>
        </Box>

        <Box pt={30} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {guesser.isCompleted ? (
            <Button color="violet" variant="filled" onClick={guesser.reset} leftSection={<RiRestartLine />}>
              Restart
            </Button>
          ) : (
            <>
              <Button
                color="violet"
                variant="filled"
                onClick={() => {
                  guesser.selectNextNode();
                  playSound("wind", { volume: 0.4, playbackRate: 3 });
                }}
                leftSection={<RiSkipForwardFill />}
              >
                Skip
              </Button>

              {process.env.NODE_ENV === "development" && (
                <Button
                  color="green"
                  variant="filled"
                  onClick={() => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value)}
                  leftSection={<RiCheckDoubleFill />}
                >
                  Fill
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
