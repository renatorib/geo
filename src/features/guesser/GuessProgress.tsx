import React from "react";

import { ProgressBar } from "~/components";
import { Entity } from "~/games";

import { TimerControl } from "../timer/TimerControl";

import { Guesser } from "./use-guesser";

export const GuessProgress = <T extends Entity>(props: { guesser: Guesser<T> }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="grow">
        <ProgressBar progress={props.guesser.totalChecked / props.guesser.data.length} />
      </div>
      <div className="shrink-0 text-xs font-mono text-stone-600">
        {props.guesser.totalChecked} of {props.guesser.data.length}
      </div>
      <div className="shrink-0 text-xs">
        <TimerControl timer={props.guesser.timer} />
      </div>
    </div>
  );
};
