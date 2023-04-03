import React from "react";
import NextImage from "next/legacy/image";
import { AspectRatio, Center, Text } from "@mantine/core";
import { useLang } from "~/hooks";
import { Country } from "~/data-sources/countries";
import { DisplayProps } from "./types";

export const FlagsDisplay = ({ data, checked }: DisplayProps<Country>) => {
  const { property } = useLang();
  const name = data.name[property];

  return (
    <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
      {data.flag ? (
        <NextImage
          src={data.flag}
          alt={checked ? `Flag of ${name}` : "Flag of unknown"}
          title={checked ? name : undefined}
          objectFit="contain"
          layout="fill"
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
