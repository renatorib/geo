export const readableTime = (numberInMs: number) => {
  const diff = numberInMs / 1000;
  const H = 3600;
  const M = 60;
  const S = 1;

  const hours = Math.floor(diff / H);
  const minutes = Math.floor((diff % H) / M);
  const seconds = Math.floor(((diff % H) % M) / S);

  const hoursText = String(hours).padStart(2, "0");
  const minutesText = String(minutes).padStart(2, "0");
  const secondsText = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hoursText}:${minutesText}:${secondsText}`;
  }

  return `${minutesText}:${secondsText}`;
};
