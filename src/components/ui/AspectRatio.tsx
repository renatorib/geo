import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

export type AspectRatioProps = {
  ratio?: number;
  wrapperProps?: React.ComponentProps<"div">;
};

export const AspectRatioDefaultProps = {
  ratio: 1 / 1,
} satisfies AspectRatioProps;

export const AspectRatio = fr<AspectRatioProps>(
  ({ ratio = AspectRatioDefaultProps.ratio, wrapperProps, ...props }, ref) => (
    <div
      {...wrapperProps}
      className={cn("relative w-full", wrapperProps?.className)}
      style={{ ...wrapperProps?.style, paddingBottom: `${100 / ratio}%` }}
    >
      <div {...props} ref={ref} className={cn("absolute inset-0", props.className)} />
    </div>
  ),
);
