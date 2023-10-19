import React from "react";

import { Box } from "@mantine/core";
import { RiMicLine } from "react-icons/ri";

export const MicOn = () => {
  return (
    <Box style={{ animation: "blink 1.5s ease-in-out infinite", display: "inline-flex" }}>
      <RiMicLine color="red" />
    </Box>
  );
};
