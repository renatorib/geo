import React from "react";

import { debounce } from "~/lib/fn";

import { useEvent } from "./use-event";

export const useDebouncedEvent = <T extends (...a: any[]) => any>(func: T, wait: number) => {
  const fn = useEvent(func);
  return React.useCallback(debounce(fn, wait), []); // eslint-disable-line
};
