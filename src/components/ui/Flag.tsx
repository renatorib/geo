import NextImage from "next/image";
import { StaticImageData } from "next/image";
import React from "react";

import { AspectRatio } from "./AspectRatio";

type FlagProps = {
  src: StaticImageData;
  width?: string | number;
  fit?: React.CSSProperties["objectFit"];
};

export const Flag = ({ src, width = "100%", fit = "contain" }: FlagProps) => {
  return (
    <div style={{ width }}>
      <AspectRatio ratio={45 / 30} style={{ width, overflow: "hidden" }}>
        <NextImage src={src} alt="" fill sizes="100vw" style={{ objectFit: fit }} />
      </AspectRatio>
    </div>
  );
};
