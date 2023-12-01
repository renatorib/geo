import React from "react";

export function useInterval(fn: () => void, interval: number) {
  const [active, setActive] = React.useState(false);
  const intervalRef = React.useRef<number>();
  const fnRef = React.useRef<() => void>();

  React.useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const start = () => {
    setActive((old) => {
      if (!old && !intervalRef.current) {
        intervalRef.current = window.setInterval(fnRef.current!, interval);
      }
      return true;
    });
  };

  const stop = () => {
    setActive(false);
    window.clearInterval(intervalRef.current);
    intervalRef.current = undefined;
  };

  const toggle = () => {
    if (active) {
      stop();
    } else {
      start();
    }
  };

  return { start, stop, toggle, active };
}
