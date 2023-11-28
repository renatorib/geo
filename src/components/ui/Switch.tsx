import React from "react";

import { Checkbox as AriakitCheckbox } from "@ariakit/react";

import { fr } from "~/lib/react";
import { cn, contextColors, fontSizes, radii, shadows, transitions } from "~/lib/styles";

export const variants = /* tw */ {
  filled: {
    input: "bg-slate-300 checked:bg-context-600 disabled:opacity-50",
    circle: "bg-white text-slate-600 peer-checked:text-context-600",
  },
  light: {
    input: "bg-slate-300 checked:bg-context-300",
    circle: "bg-white text-slate-500 peer-checked:bg-context-600 peer-checked:text-context-200",
  },
  outline: {
    input: "checked:bg-transparent border-slate-300 checked:border-context-600 ",
    circle: "bg-slate-300 text-slate-500 peer-checked:bg-context-600 peer-checked:text-white",
  },
  white: {
    input: "bg-white",
    circle: "bg-slate-200 text-slate-500 peer-checked:bg-context-600 peer-checked:text-white",
  },
  none: {
    input: "",
    circle: "",
  },
};

type SwitchProps = {
  variant?: keyof typeof variants;

  color?: keyof typeof contextColors;
  radius?: keyof typeof radii;
  size?: keyof typeof fontSizes;
  shadow?: keyof typeof shadows;
  transition?: keyof typeof transitions;

  disabled?: boolean;
  loading?: boolean;
  classes?: {
    root?: string;
    input?: string;
    circle?: string;
  };
};

export const SwitchDefaultProps = {
  variant: "filled",
  color: "slate",
  radius: "full",
  size: "md",
  shadow: "none",
  transition: "normal",
  disabled: false,
  loading: false,
} satisfies SwitchProps;

export const Switch = fr<SwitchProps, typeof AriakitCheckbox>(
  (
    {
      variant = SwitchDefaultProps.variant,
      color = SwitchDefaultProps.color,
      radius = SwitchDefaultProps.radius,
      size = SwitchDefaultProps.size,
      shadow = SwitchDefaultProps.shadow,
      transition = SwitchDefaultProps.transition,

      disabled,
      loading,
      classes,
      ...props
    },
    ref,
  ) => (
    <div className={cn("relative inline-flex text-[0rem]", contextColors[color], classes?.root)}>
      <AriakitCheckbox
        ref={ref}
        clickOnEnter={true}
        {...props}
        role="switch"
        disabled={disabled}
        className={cn(
          "border border-transparent",
          "peer appearance-none inline-block w-[2em] h-[1.25em] cursor-pointer",
          variants[variant].input,
          radii[radius],
          shadows[shadow],
          transitions[transition],
          fontSizes[size],
          classes?.root,
          props.className,
        )}
      />
      <div
        role="presentation"
        className={cn(
          "absolute pointer-events-none w-[1em] h-[1em] top-[0.125em] left-[0.125em] peer-checked:left-[0.875em]",
          transition !== "none" &&
            "peer-enabled:peer-active:w-[1.125em] peer-enabled:peer-checked:peer-active:left-[0.75em]",
          variants[variant].circle,
          radii[radius],
          transitions[transition],
          fontSizes[size],
          classes?.circle,
        )}
      >
        {loading && "..."}
      </div>
    </div>
  ),
);
