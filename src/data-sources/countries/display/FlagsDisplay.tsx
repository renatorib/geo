import React from "react";
import NextImage from "next/image";
import { AspectRatio, Center, Text } from "@mantine/core";
import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useLang } from "~/features/i18n";

export const FlagsDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { property } = useLang();
  const name = data.name[property];

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
          <Text color="red" size="xs">
            Flag not found
          </Text>
        </Center>
      )}
    </AspectRatio>
  );
};
