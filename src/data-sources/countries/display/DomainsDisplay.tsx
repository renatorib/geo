import React from "react";
import { AspectRatio, Box, Center, Text, useMantineTheme } from "@mantine/core";
import { Country } from "~/data-sources/countries";
import { DisplayProps } from "./types";

export const DomainsDisplay = ({ data, checked }: DisplayProps<Country>) => {
  const theme = useMantineTheme();
  const color = checked === "correct" ? "green" : checked === "spoiler" ? "red" : theme.colors.dark[4];

  return (
    <Box>
      {data.domain ? (
        <AspectRatio ratio={5 / 2} style={{ width: "100%" }}>
          <Center>
            <Box>
              <Text color={color} size={38} align="center" weight={500}>
                {data.domain}
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
