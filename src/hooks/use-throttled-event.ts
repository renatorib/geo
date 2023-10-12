import React from "react";

import { throttle } from "~/lib/fn";

import { useEvent } from "./use-event";

export const useThrottledEvent = <T extends (...a: any[]) => any>(func: T, wait: number) => {
  const fn = useEvent(func);
  return React.useCallback(throttle(fn, wait), []); // eslint-disable-line
};
