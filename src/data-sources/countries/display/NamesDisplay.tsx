import React from "react";

import { AspectRatio, Box, Center, Text, useMantineTheme } from "@mantine/core";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";

export const NamesDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { lang } = useSettings();
  const theme = useMantineTheme();
  const color =
    status === "correct" ? theme.colors.green[8] : status === "spoiler" ? theme.colors.red[8] : theme.colors.dark[4];
  const name = data.name[lang.property];
  const nameEn = data.name.en;

  return (
    <Box>
      {name ? (
        <AspectRatio ratio={5 / 2} style={{ width: "100%" }}>
          <Center>
            <Box>
              <Text c={color} fz={16} ta="center" fw={700}>
                {name}
              </Text>
              {name !== nameEn && (
                <div style={{ opacity: 0.5, fontSize: 14 }}>
                  <Text c={color} ta="center">
                    ({nameEn})
                  </Text>
                </div>
              )}
            </Box>
          </Center>
        </AspectRatio>
      ) : (
        <AspectRatio ratio={5 / 2} style={{ width: "100%" }}>
          <Center>
            <Text c="red" size="xs">
              ?
            </Text>
          </Center>
        </AspectRatio>
      )}
    </Box>
  );
};
