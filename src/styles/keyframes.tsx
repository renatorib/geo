import { keyframes } from "@mantine/core";

export const blink = keyframes({
  "0, 100%": { opacity: 1 },
  "50%": { opacity: 0.2 },
});

export const pop = keyframes({
  "0%": { transform: "rotate(-60deg) scale(0.05)" },
  "60%": { transform: "rotate(40deg) scale(2)" },
  "100%": { transform: "rotate(0deg) scale(1)" },
});
