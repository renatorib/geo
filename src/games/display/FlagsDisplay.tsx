import React from "react";
import NextImage from "next/image";
import { AspectRatio, Center, Text } from "@mantine/core";
import { useLang } from "~/hooks";
import { DisplayProps } from "./types";

export const FlagsDisplay = ({ country, checked }: DisplayProps) => {
  const { property } = useLang();
  const name = country.name[property];

  return (
    <AspectRatio ratio={45 / 30} style={{ width: "100%" }}>
      {country.flag ? (
        <NextImage
          src={country.flag}
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
