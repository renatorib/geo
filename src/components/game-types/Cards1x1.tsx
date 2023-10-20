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
import { useGuesser } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { TimerControl } from "~/features/timer";
import { Entity, Answer } from "~/games";
import { useAnimateEffect } from "~/hooks/use-animate-effect";

import { ProgressBar } from "../ProgressBar";
import { QuizCard } from "../QuizCard";

type Cards1x1Props<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title: string;
  display?: Display<T>;
};

export const Cards1x1 = <T extends Entity>(props: Cards1x1Props<T>) => {
  const settings = useSettings();

  const [correctText, setCorrectText] = React.useState("");
  const effect = useAnimateEffect(
    [
      { opacity: 0, transform: "scale(1.5)" },
      { opacity: 0.5, transform: "scale(1.8)" },
      { opacity: 0, transform: "scale(1.5)" },
    ],
    { duration: 1000, easing: "ease-out" },
  );

  const guesser = useGuesser({
    data: props.data,
    answer: props.answer,
    title: props.title,
    onCorrectGuess: (node) => {
      setCorrectText(guesser.answer(node).value);
      effect.animate();
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
                    <Menu.Item
                      leftSection={<RiShuffleFill />}
                      onClick={() => {
                        guesser.shuffle();
                      }}
                    >
                      Shuffle
                    </Menu.Item>
                    <Menu.Item leftSection={<RiRestartLine />} onClick={() => guesser.reset()}>
                      Reset
                    </Menu.Item>
                    <Menu.Item leftSection={<RiTimerFill />} onClick={() => settings.setTimer((v) => !v)}>
                      {settings.timer ? "Hide timer" : "Show timer"}
                    </Menu.Item>
                    <Menu.Divider />
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
            <Box>
              <ProgressBar progress={guesser.totalChecked / guesser.data.length} />
            </Box>
          </Stack>
        </Box>

        <Box pos="relative">
          <div
            ref={effect.ref}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0,
              zIndex: 2,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              fz={correctText.length > 15 ? 30 : 50}
              fw={700}
              c="#99FF99"
              ta="center"
              style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.8)" }}
            >
              {correctText}
            </Box>
          </div>
          {!guesser.isCompleted && (
            <QuizCard
              key={guesser.selectedNode.id}
              id={guesser.selectedNode.id}
              name={guesser.answer(guesser.selectedNode).value}
              status={guesser.getNodeStatus(guesser.selectedNode)}
              onGuess={(text) => guesser.guess(guesser.selectedNode, text)}
            >
              {props.display
                ? props.display({
                    data: guesser.selectedNode.entity,
                    status: guesser.getNodeStatus(guesser.selectedNode),
                  })
                : null}
            </QuizCard>
          )}
        </Box>

        <Box pt={30} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {guesser.isCompleted ? (
            <Button color="violet" variant="filled" onClick={guesser.reset} leftSection={<RiRestartLine />}>
              Restart
            </Button>
          ) : (
            <>
              <Button
                color="red"
                variant="outline"
                onClick={guesser.toggleSpoiler}
                leftSection={guesser.spoiler ? <RiEyeCloseLine /> : <RiEyeLine />}
              >
                Spoiler
              </Button>
              <Button
                color="green"
                variant="outline"
                onClick={() => guesser.guess(guesser.selectedNode, guesser.answer(guesser.selectedNode).value)}
                leftSection={guesser.spoiler ? <RiEyeCloseLine /> : <RiEyeLine />}
              >
                Fill
              </Button>
              <Button
                color="violet"
                variant="filled"
                onClick={() => guesser.selectNextNode()}
                leftSection={<RiSkipForwardFill />}
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
