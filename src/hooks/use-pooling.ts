import React from "react";

import { useEvent } from "./use-event";
import { useInterval } from "./use-interval";

export const usePooling = (tick: () => any, intervalMs: number) => {
  const interval = useInterval(useEvent(tick), intervalMs);

  React.useEffect(() => {
    interval.start();
    return interval.stop;
  }, []); // eslint-disable-line
};
