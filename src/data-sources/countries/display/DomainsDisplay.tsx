import React from "react";

import { AspectRatio, Text, useMantineTheme } from "@mantine/core";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";

export const DomainsDisplay = ({ data, status }: DisplayProps<Country>) => {
  const theme = useMantineTheme();
  const color = status === "correct" ? "green" : status === "spoiler" ? "red" : theme.colors.dark[4];

  return (
    <div>
      {data.domain ? (
        <AspectRatio ratio={5 / 2} className="w-full">
          <div className="grid place-items-center">
            <div>
              <Text c={color} fz={38} ta="center" w={500}>
                {data.domain}
              </Text>
            </div>
          </div>
        </AspectRatio>
      ) : (
        <AspectRatio ratio={5 / 2} className="w-full">
          <div className="grid place-items-center">
            <Text c="red" size="xs">
              ?
            </Text>
          </div>
        </AspectRatio>
      )}
    </div>
  );
};
