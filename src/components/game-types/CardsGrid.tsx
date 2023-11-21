import React from "react";

import { Menu } from "@mantine/core";
import { RiShuffleFill, RiEyeLine, RiMore2Fill, RiEyeCloseLine, RiRestartLine } from "react-icons/ri";

import { GuessCard, GuessInput, useGuesser } from "~/features/guesser";
import { useSettings } from "~/features/settings";
import { TimerControl } from "~/features/timer";
import { GameProps } from "~/games";

import { ButtonIcon } from "../ui/ButtonIcon";
import { Text } from "../ui/Text";

type CardsGridProps = {
  game: GameProps;
};

export const CardsGrid = ({ game }: CardsGridProps) => {
  const settings = useSettings();

  const guesser = useGuesser({
    data: game.filteredData,
    answer: game.answer,
    title: game.title,
    onSelectNode: (node) => GuessInput.focusById(node.id),
  });

  return (
    <div className="flex flex-col gap-2 w-full pt-4">
      <div className="py-4 -mx-2 px-2 sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-6">
          <Text weight={700}>{game.title}</Text>

          <Text muted>
            {guesser.totalChecked} / {guesser.data.length}
          </Text>

          {settings.timer && <TimerControl timer={guesser.timer} />}

          <div className="flex items-center ml-auto gap-1">
            <Menu shadow="md" width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <ButtonIcon radius="full" variant="outline">
                  <RiMore2Fill size={20} />
                </ButtonIcon>
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {guesser.data.map((node) => {
          const value = guesser.getNodeValue(node);
          const status = guesser.getNodeStatus(node);

          return (
            <div key={node.id}>
              <GuessCard status={status} onClick={() => GuessInput.focusById(node.id)}>
                {game.display ? game.display({ data: node.entity, status }) : null}
                <GuessInput
                  id={node.entity.id}
                  name={value}
                  status={status}
                  onGuess={(text) => guesser.guess(node, text)}
                />
              </GuessCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
