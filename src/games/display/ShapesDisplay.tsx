import React from "react";
import { AspectRatio, Box, Center, Text, useMantineTheme } from "@mantine/core";
import { DisplayProps } from "./types";
import { zoomIntoPath } from "~/modules/svg/viewbox";

export const ShapesDisplay = ({ country, checked }: DisplayProps) => {
  const theme = useMantineTheme();

  const shapeViewbox = React.useMemo(() => {
    const zoom = zoomIntoPath(country.shape);
    const size = Math.max(zoom.viewboxWidth, zoom.viewboxHeight);
    return { viewbox: zoom.viewbox, size: size };
  }, [country.shape]);

  return (
    <Box>
      {country.shape && shapeViewbox.viewbox ? (
        <svg viewBox={shapeViewbox.viewbox} width="100%" height="100%">
          <path
            d={country.shape}
            stroke={checked ? theme.colors.green[7] : theme.colors.gray[5]}
            fill={checked ? theme.colors.green[4] : theme.colors.gray[3]}
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
