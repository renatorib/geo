import React from "react";

export const useTimer = () => {
  const [started, setStarted] = React.useState<number>();

  const start = () => {
    setStarted(Date.now());
  };

  const end = () => {
    setStarted(undefined);
    return started ? Date.now() - started : 0;
  };

  const reset = () => {
    setStarted(undefined);
  };

  return { started, start, end, reset };
};

export type Timer = ReturnType<typeof useTimer>;
