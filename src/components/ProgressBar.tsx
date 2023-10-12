import { Box, useMantineTheme } from "@mantine/core";
import React from "react";

export const ProgressBar = (props: { progress: number }) => {
  const theme = useMantineTheme();
  return (
    <Box sx={{ height: 6, borderRadius: 3, overflow: "hidden", background: "#eeeeee" }}>
      <Box
        sx={{
          height: "100%",
          width: `${props.progress * 100}%`,
          background: theme.colors.violet[6],
          transition: "all 200ms ease",
        }}
      />
    </Box>
  );
};
