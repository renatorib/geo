import NextImage from "next/image";
import React from "react";

import { AspectRatio, Center, Text } from "@mantine/core";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";

export const FlagsDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { lang } = useSettings();
  const name = data.name[lang.property];

  return (
    <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
      {data.flag ? (
        <NextImage
          src={data.flag}
          alt={status !== "idle" ? `Flag of ${name}` : "Flag of unknown"}
          title={status !== "idle" ? name : undefined}
          fill
          sizes="100vw"
          style={{
            objectFit: "contain",
          }}
        />
      ) : (
        <Center>
          <Text c="red" size="xs">
            Flag not found
          </Text>
        </Center>
      )}
    </AspectRatio>
  );
};
