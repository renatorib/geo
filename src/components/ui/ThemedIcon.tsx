import React from "react";

import { fr } from "~/lib/react";
import { cn, contextColors } from "~/lib/styles";

export const variants = /* tw */ {
  transparent: {
    root: "bg-transparent text-context-800",
  },
  "transparent-light": {
    root: "bg-transparent text-context-100",
  },
  light: {
    root: "bg-context-100 text-context-800",
  },
  filled: {
    root: "bg-context-800 text-context-100",
  },
};

export const ThemedIcon = fr<{ variant?: keyof typeof variants; color?: keyof typeof contextColors }>(
  ({ variant = "light", color = "violet", ...props }, ref) => {
    const classes = cn(contextColors[color], variants[variant].root);

    return (
      <div ref={ref} {...props} className={cn("w-[1.5em] h-[1.5em] rounded", classes, props.className)}>
        <span className="text-lg align-middle">{props.children}</span>
      </div>
    );
  },
);
