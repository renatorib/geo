import React from "react";
import NextImage from "next/image";
import { StaticImageData } from "next/image";
import { AspectRatio } from "@mantine/core";

type FlagProps = {
  src: StaticImageData;
  width?: string | number;
  fit?: React.CSSProperties["objectFit"];
};

export const Flag = ({ src, width = "100%", fit = "contain" }: FlagProps) => {
  return (
    <AspectRatio ratio={45 / 30} style={{ width, overflow: "hidden" }}>
      <NextImage src={src} layout="fill" style={{ objectFit: fit }} alt="" />
    </AspectRatio>
  );
};
