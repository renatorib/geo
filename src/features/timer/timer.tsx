import React from "react";

import { ActionIcon, Box, Text } from "@mantine/core";
import { RiPlayCircleFill } from "react-icons/ri";

import { useEvent, usePooling } from "~/hooks";

export const useTimer = () => {
  const [started, setStarted] = React.useState<number>();

  const start = () => {
    setStarted(Date.now());
  };

  const end = () => {
    setStarted(undefined);
    return started ? timeDiff(started, Date.now()) : "00";
  };

  const reset = () => {
    setStarted(undefined);
  };

  return { started, start, end, reset };
};

export type Timer = ReturnType<typeof useTimer>;

export const TimerClock = ({ started }: { started: number | undefined }) => {
  const [time, setTime] = React.useState("");

  const tick = useEvent(() => {
    if (started) {
      setTime(timeDiff(started, Date.now()));
    }
  });

  React.useEffect(() => void tick(), [started]); // eslint-disable-line
  usePooling(() => tick(), 300);

  return <>{time}</>;
};

export const TimerControl = ({ timer }: { timer: Timer }) => {
  return (
    <Box style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <Text c={timer.started ? "orange" : "gray"} fw={700}>
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
    </Box>
  );
};

function timeDiff(from: number, to: number = Date.now()) {
  const diff = (to - from) / 1000;
  const H = 3600;
  const M = 60;
  const S = 1;

  const hours = Math.floor(diff / H);
  const minutes = Math.floor((diff % H) / M);
  const seconds = Math.floor(((diff % H) % M) / S);

  const hoursText = String(hours).padStart(2, "0");
  const minutesText = String(minutes).padStart(2, "0");
  const secondsText = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hoursText}:${minutesText}:${secondsText}`;
  }
  return `${minutesText}:${secondsText}`;
}
