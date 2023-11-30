import React from "react";

import { fr } from "~/lib/react";
import { cn, contextColors, fontSizes, paddingsSize, radii, shadows, transitions } from "~/lib/styles";

export const variants = /* tw */ {
  outline: {
    root: "text-current-800 outline-current-300 data-[disabled=false]:hover:outline-current-400 data-[disabled=false]:hover:text-current-900 data-[disabled=false]:focus-within:outline-current-400 data-[disabled=false]:focus-within:text-current-900",
    input: "placeholder:text-current-400",
  },
  filled: {
    root: "text-current-50 bg-current-600 outline-transparent data-[disabled=false]:focus-within:outline-offset-2 data-[disabled=false]:focus-within:outline-current-900 data-[disabled=false]:hover:bg-current-800 data-[disabled=false]:hover:text-white data-[disabled=false]:focus-within:bg-current-800 data-[disabled=false]:focus-within:text-white",
    input: "placeholder:text-current-500",
  },
  light: {
    root: "text-current-800 bg-current-200 data-[disabled=false]:hover:bg-current-300 data-[disabled=false]:hover:text-current-900",
    input: "placeholder:text-current-400",
  },
  ghost: {
    root: "text-current-800 bg-transparent data-[disabled=false]:hover:bg-current-200",
    input: "placeholder:text-current-400",
  },
  white: {
    root: "text-current-800 bg-white data-[disabled=false]:hover:bg-current-200",
    input: "placeholder:text-current-400",
  },
};

export type InputProps = {
  color?: keyof typeof contextColors;
  radius?: keyof typeof radii;
  size?: keyof typeof fontSizes;
  padding?: keyof typeof paddingsSize;
  transition?: keyof typeof transitions;
  shadow?: keyof typeof shadows;

  variant?: keyof typeof variants;

  left?: React.ReactNode;
  right?: React.ReactNode;
  full?: boolean;
  disabled?: boolean;

  classes?: {
    root?: string;
    input?: string;
    addon?: string;
    left?: string;
    right?: string;
  };
};

export const InputDefaultProps = {
  variant: "outline",
  color: "slate",
  size: "md",
  radius: "md",
  padding: "md",
  shadow: "none",
  transition: "normal",
  full: false,
  disabled: false,
} satisfies Partial<InputProps>;

export const Input = fr<InputProps, "input">(
  (
    {
      variant = InputDefaultProps.variant,
      color = InputDefaultProps.color,
      size = InputDefaultProps.size,
      radius = InputDefaultProps.radius,
      padding = InputDefaultProps.padding,
      shadow = InputDefaultProps.shadow,
      transition = InputDefaultProps.transition,

      left,
      right,
      full = InputDefaultProps.full,
      disabled = InputDefaultProps.disabled,

      classes = {},
      ...props
    },
    ref,
  ) => {
    return (
      <div
        data-disabled={String(disabled ?? false)}
        className={cn(
          "relative inline-flex items-center gap-[0.5em] border border-transparent",
          "outline outline-current-400 outline-1 -outline-offset-1",
          "focus-within:outline-2 focus-within:-outline-offset-2",
          "data-[disabled=true]:opacity-50",
          full && "w-full",
          color && contextColors[color],
          variants[variant].root,
          radii[radius],
          paddingsSize[padding],
          fontSizes[size],
          transitions[transition],
          shadows[shadow],
          classes?.root,
          props.className,
        )}
      >
        {left ? <div className={cn("inline-flex items-center", classes.addon, classes.left)}>{left}</div> : null}

        <input
          ref={ref}
          {...props}
          disabled={disabled}
          className={cn(
            "border-none bg-transparent focus:outline-none w-full",
            variants[variant].input,
            classes?.input,
          )}
        />

        {right ? <div className={cn("inline-flex items-center", classes.addon, classes.right)}>{right}</div> : null}
      </div>
    );
  },
);
