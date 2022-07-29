import React from "react";
import { throttle } from "~/modules/function";
import { useEvent } from "./useEvent";

export const useThrottledEvent = <T extends (...a: any[]) => any>(func: T, wait: number) => {
  const fn = useEvent(func);
  return React.useCallback(throttle(fn, wait), []); // eslint-disable-line
};
