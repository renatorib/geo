import React from "react";

import { fr } from "~/lib/react";
import {
  cn,
  contextColors,
  fontSizes,
  paddingsSize,
  paddingsSizeSquare,
  radii,
  shadows,
  transitions,
} from "~/lib/styles";

export const variants = /* tw */ {
  filled: {
    root: "text-context-50 bg-context-700 aria-[disabled=false]:hover:bg-context-800 aria-[disabled=false]:hover:white aria-[disabled=false]:active:bg-context-900",
  },
  light: {
    root: "text-context-800 bg-context-200 aria-[disabled=false]:hover:bg-context-300 aria-[disabled=false]:hover:text-context-900 aria-[disabled=false]:active:bg-context-400",
  },
  outline: {
    root: "text-context-800 border-context-300 aria-[disabled=false]:hover:border-context-400 aria-[disabled=false]:hover:text-context-900 aria-[disabled=false]:active:border-context-600",
  },
  ghost: {
    root: "text-context-800 bg-transparent aria-[disabled=false]:hover:bg-context-200 aria-[disabled=false]:active:bg-context-300",
  },
  muted: {
    root: "text-context-400 bg-transparent aria-[disabled=false]:hover:text-context-800 aria-[disabled=false]:hover:bg-context-200 aria-[disabled=false]:active:bg-context-300",
  },
  white: {
    root: "text-context-800 bg-white aria-[disabled=false]:hover:bg-context-200 aria-[disabled=false]:active:bg-context-300",
  },
  link: {
    root: "text-context-800 bg-transparent aria-[disabled=false]:hover:text-context-900 aria-[disabled=false]:hover:underline aria-[disabled=false]:active:text-context-950",
  },
  none: {
    root: "",
  },
};

export type ButtonProps = {
  variant?: keyof typeof variants;

  color?: keyof typeof contextColors;
  radius?: keyof typeof radii;
  size?: keyof typeof fontSizes;
  padding?: keyof typeof paddingsSize;
  transition?: keyof typeof transitions;
  shadow?: keyof typeof shadows;

  disabled?: boolean;
  loading?: boolean;
  progress?: number;
  full?: boolean;
  paddingSquare?: boolean;

  classes?: {
    root?: string;
    inner?: string;
    spinnerWrapper?: string;
    spinner?: string;
    progressWrapper?: string;
  };
};

const ButtonDefaultProps = {
  variant: "filled",
  radius: "md",
  padding: "md",
  shadow: "none",
  size: "md",
  transition: "normal",
  disabled: false,
  loading: false,
  progress: 0,
  full: false,
  paddingSquare: false,
} satisfies Partial<ButtonProps>;

export const Button = fr<ButtonProps, "button">(
  (
    {
      color,
      variant = ButtonDefaultProps.variant,
      radius = ButtonDefaultProps.radius,
      padding = ButtonDefaultProps.padding,
      shadow = ButtonDefaultProps.shadow,
      size = ButtonDefaultProps.size,
      transition = ButtonDefaultProps.transition,
      loading = ButtonDefaultProps.loading,
      progress = ButtonDefaultProps.progress,
      full = ButtonDefaultProps.full,
      paddingSquare = false,
      classes = {},
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        aria-disabled={props.disabled ?? false}
        className={cn(
          "group/button relative inline-flex items-center justify-start gap-1 border border-solid border-transparent",
          "outline-context-100 disabled:opacity-75 disabled:select-none",
          "[&>svg]:w-[1.2em] [&>svg]:h-[1.2em]",
          full && "w-full",
          color && contextColors[color],
          variants[variant].root,
          radii[radius],
          paddingSquare ? paddingsSizeSquare[padding] : paddingsSize[padding],
          fontSizes[size],
          transitions[transition],
          shadows[shadow],
          classes.root,
          props.className,
        )}
      >
        {props.children}

        {loading && (
          <div className={cn("absolute inset-0 grid place-items-center", radii[radius], classes.spinnerWrapper)}>
            ...
          </div>
        )}

        {progress != null && progress > 0 && (
          <div
            className={cn(
              "transform transition-transform absolute left-[2px] right-[2px] bottom-[1px] h-1 rounded-full bg-context-400",
              classes.progressWrapper,
            )}
            style={{ transform: `scaleX(${Math.max(Math.min(progress, 1), 0) * 100}%)`, transformOrigin: "left" }}
          />
        )}
      </button>
    );
  },
);
