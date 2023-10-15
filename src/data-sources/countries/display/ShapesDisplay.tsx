import React from "react";

import { AspectRatio, Box, Center, Text, useMantineTheme } from "@mantine/core";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { getViewboxOfPath } from "~/lib/svg";

export const ShapesDisplay = ({ data, status }: DisplayProps<Country>) => {
  const theme = useMantineTheme();

  const shapeViewbox = React.useMemo(() => {
    const vb = getViewboxOfPath(data.shape, { aspectRatio: 45 / 30, margin: 0.5 });
    const size = Math.max(vb.viewboxWidth, vb.viewboxHeight);
    return { viewbox: vb.viewbox, size: size };
  }, [data.shape]);

  return (
    <Box>
      {data.shape && shapeViewbox.viewbox ? (
        <svg viewBox={shapeViewbox.viewbox} width="100%" height="100%">
          <path
            d={data.shape}
            stroke={status !== "idle" ? theme.colors.green[7] : theme.colors.gray[5]}
            fill={status !== "idle" ? theme.colors.green[4] : theme.colors.gray[3]}
            strokeWidth={shapeViewbox.size * 0.006}
          />
        </svg>
      ) : (
        <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
          <Center>
            <Text color="red" size="xs">
              Country shape not found
            </Text>
          </Center>
        </AspectRatio>
      )}
    </Box>
  );
};
