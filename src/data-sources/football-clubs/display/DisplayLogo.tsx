import React from "react";
import NextImage from "next/image";
import { AspectRatio, Center, Text } from "@mantine/core";
import { DisplayProps } from "~/data-sources";
import { FootballClub } from "..";

const Img = "img";
export const DisplayLogo = ({ data, status }: DisplayProps<FootballClub>) => {
  const name = data.name;

  // eslint-disable-next-line
  return (
    <AspectRatio ratio={2 / 1} style={{ width: "100%" }}>
      {data.logo ? (
        <Img
          src={data.logo}
          alt={status !== "idle" ? `Logo of ${name}` : "Logo of unknown"}
          title={status !== "idle" ? name : undefined}
          style={{ padding: 10, objectFit: "contain" }}
        />
      ) : (
        <Center>
          <Text color="red" size="xs">
            Logo not found
          </Text>
        </Center>
      )}
    </AspectRatio>
  );
};
