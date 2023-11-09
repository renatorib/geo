import React from "react";

import { fr } from "~/lib/react";
import { cn, contextColors, fontSizes, fontWeights } from "~/lib/styles";

export type TextProps = {
  color?: keyof typeof contextColors;
  size?: keyof typeof fontSizes;
  weight?: keyof typeof fontWeights;
  muted?: boolean;
};

export const Text = fr<TextProps, "span">((_props, ref) => {
  const { color = "current", size = "base", weight = "normal", muted = false, ...props } = _props;
  const classes = cn(
    contextColors[color],
    fontSizes[size],
    fontWeights[weight],
    muted ? "text-context-400" : "text-context-800",
  );

  return (
    <span ref={ref} {...props} className={cn(classes, props.className)}>
      {props.children}
    </span>
  );
});
