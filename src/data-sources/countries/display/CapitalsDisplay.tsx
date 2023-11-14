import React from "react";

import { AspectRatio, Text, useMantineTheme } from "@mantine/core";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";

export const CapitalsDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { lang } = useSettings();
  const theme = useMantineTheme();
  const color =
    status === "correct" ? theme.colors.green[8] : status === "spoiler" ? theme.colors.red[8] : theme.colors.dark[4];
  const name = data.capital[lang.property];
  const nameEn = data.capital.en;

  return (
    <div>
      {name ? (
        <AspectRatio ratio={5 / 2} className="w-full">
          <div className="grid place-items-center">
            <div>
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
