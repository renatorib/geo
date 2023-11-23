import React from "react";

import { Text } from "~/components/ui/Text";

import { useSettings } from "../settings";

import { TimerClock } from "./TimerClock";
import { Timer } from "./use-timer";

export const TimerControl = ({ timer }: { timer: Timer }) => {
  const settings = useSettings();
  if (!settings.timer) return null;
  return (
    <div className="flex items-center gap-1 font-mono">
      <Text color={timer.started ? "violet" : "gray"} weight={700} size="lg">
        <TimerClock started={timer.started} />
      </Text>
    </div>
  );
};
