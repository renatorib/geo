import React from "react";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type AnyFunction = (...args: any[]) => any;

export function useEvent<T extends AnyFunction>(callback?: T) {
  const ref = React.useRef<AnyFunction | undefined>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = callback;
  });

  return React.useCallback<AnyFunction>((...args) => ref.current?.apply(null, args), []) as T;
}
