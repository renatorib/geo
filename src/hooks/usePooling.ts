import React from "react";
import { useInterval } from "@mantine/hooks";
import { useEvent } from "./useEvent";

export const usePooling = (tick: () => any, intervalMs: number) => {
  const interval = useInterval(useEvent(tick), intervalMs);

  React.useEffect(() => {
    interval.start();
    return interval.stop;
  }, []); // eslint-disable-line
};
