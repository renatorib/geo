import React from "react";

import { RiPlayCircleFill } from "react-icons/ri";

import { ButtonIcon } from "~/components/ui/ButtonIcon";
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
        <ButtonIcon
          onClick={() => timer.start()}
          color="green"
          radius="full"
          variant="ghost"
          size="md"
          style={{ marginTop: -2 }}
        >
          <RiPlayCircleFill size={20} />
        </ButtonIcon>
      )}
    </div>
  );
};
