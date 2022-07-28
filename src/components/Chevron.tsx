import React, { ReactSVG } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

export const Chevron = ({ opened, ...props }: { opened: boolean } & React.ComponentProps<typeof RiArrowDownSLine>) => {
  return (
    <RiArrowDownSLine
      {...props}
      style={{
        transform: opened ? "rotate(180deg)" : "rotate(0deg",
        transition: "transform 200ms ease",
        ...props.style,
      }}
    />
  );
};
