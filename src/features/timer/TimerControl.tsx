import React from "react";

import { ActionIcon } from "@mantine/core";
import { RiPlayCircleFill } from "react-icons/ri";

import { Text } from "~/components/ui/Text";

import { TimerClock } from "./TimerClock";
import { Timer } from "./use-timer";

export const TimerControl = ({ timer }: { timer: Timer }) => {
  return (
    <div className="flex items-center gap-1">
      <Text color={timer.started ? "orange" : "gray"} weight={700}>
        <TimerClock started={timer.started} />
      </Text>
      {!timer.started && (
        <ActionIcon
          onClick={() => timer.start()}
          color="green"
          radius="xl"
          variant="subtle"
          size="md"
          style={{ marginTop: -2 }}
        >
          <RiPlayCircleFill size={20} />
        </ActionIcon>
      )}
    </div>
  );
};
