import React from "react";

import { useEvent, usePooling } from "~/hooks";

import { readableTime } from "./utils";

export const TimerClock = ({ started }: { started: number | undefined }) => {
  const [time, setTime] = React.useState<number>(0);
  const tick = useEvent(() => started && setTime(Date.now() - started));
  React.useEffect(() => void tick(), [started]); // eslint-disable-line
  usePooling(() => tick(), 300);

  return <>{readableTime(time)}</>;
};
