import React from "react";

export const AspectRatio = ({ ratio, ...props }: React.ComponentProps<"div"> & { ratio: number }) => {
  return <div {...props} style={{ paddingBottom: `${(1 / ratio) * 100}%`, ...props.style }} />;
};
