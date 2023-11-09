import React from "react";

import { Text, Group, Box, ActionIcon, Menu, Button } from "@mantine/core";
import { RiCheckDoubleFill, RiMore2Fill, RiRestartLine, RiSkipForwardFill, RiTimerFill } from "react-icons/ri";

import { useGuesser } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { playSound } from "~/features/sounds";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";

import { QuizInput } from "../QuizInput";
import { ProgressBar } from "../ui/ProgressBar";

type Cards1x1Props = {
  game: GameProps;
};

export const Cards1x1 = ({ game }: Cards1x1Props) => {
  const settings = useSettings();

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onCorrectGuess: (node) => QuizInput.clearById(node.id),
  });

  return (
    <div className="max-w-lg px-2 md:px-0 w-full grid place-items-center mx-auto">
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <div className="flex flex-col gap-2 grow w-full">
          <Group gap="xl">
            <Group gap="xl">
              <Text fw={700}>{game.title}</Text>
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
        </div>

        <div key={guesser.selectedNode.id} className="shadow rounded-lg overflow-hidden bg-gray-50">
          {game.display
            ? game.display({
                data: guesser.selectedNode.entity,
                status: guesser.getNodeStatus(guesser.selectedNode),
              })
            : null}
        </div>

        <div className="flex items-stretch gap-2 mt-2">
          <Box className="shadow-lg rounded-md grow">
            <QuizInput
              id={guesser.selectedNode.id}
              name={guesser.getNodeValue(guesser.selectedNode)}
              status={guesser.getNodeStatus(guesser.selectedNode)}
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
              disabled={guesser.isCompleted}
              autoComplete={game.data
                .map((entity) => guesser.getNode(entity))
                .filter(Boolean)
                .map((data) => guesser.getNodeValue(data))}
            />
          </Box>

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
        </div>

        {guesser.isCompleted && (
          <Box pt={30} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Button color="violet" variant="filled" onClick={guesser.reset} leftSection={<RiRestartLine />}>
              Restart
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
};
