import React from "react";

import { Box } from "@mantine/core";
import { RiMicLine } from "react-icons/ri";

import { blink } from "~/styles/keyframes";

export const MicOn = () => {
  return (
    <Box sx={{ animation: `${blink} 1.5s ease-in-out infinite`, display: "inline-flex" }}>
      <RiMicLine color="red" />
    </Box>
  );
};
