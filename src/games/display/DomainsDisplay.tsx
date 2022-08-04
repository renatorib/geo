import React from "react";
import { AspectRatio, Box, Center, Text, useMantineTheme } from "@mantine/core";
import { DisplayProps } from "./types";

export const DomainsDisplay = ({ country, checked }: DisplayProps) => {
  const theme = useMantineTheme();
  const color = checked === "correct" ? "green" : checked === "spoiler" ? "red" : theme.colors.dark[4];

  return (
    <Box>
      {country.domain ? (
        <AspectRatio ratio={5 / 2} style={{ width: "100%" }}>
          <Center>
            <Box>
              <Text color={color} size={38} align="center" weight={500}>
                {country.domain}
              </Text>
            </Box>
          </Center>
        </AspectRatio>
      ) : (
        <AspectRatio ratio={5 / 2} style={{ width: "100%" }}>
          <Center>
            <Text color="red" size="xs">
              ?
            </Text>
          </Center>
        </AspectRatio>
      )}
    </Box>
  );
};
