import React from "react";

import { cn } from "~/lib/styles";

import { useSettings } from "../settings";

import { TimerClock } from "./TimerClock";
import { Timer } from "./use-timer";

export const TimerControl = ({ timer }: { timer: Timer }) => {
  const settings = useSettings();
  if (!settings.timer) return null;
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-1.5 h-1.5 rounded-full bg-stone-800", timer.started && "bg-lime-400 animate-pulse")} />
      <div className={cn("font-mono", timer.started ? "text-lime-400" : "text-stone-600")}>
        <TimerClock started={timer.started} />
      </div>
    </div>
  );
};
