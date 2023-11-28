import React from "react";

import { Checkbox as AriakitCheckbox } from "@ariakit/react";

import { fr } from "~/lib/react";
import { contextColors, radii, fontSizes, shadows, transitions, cn } from "~/lib/styles";

export const variants = /* tw */ {
  filled: {
    root: "",
    input:
      "bg-slate-200 border-slate-300 enabled:hover:border-slate-400 checked:border-transparent checked:bg-context-600 checked:enabled:hover:border-context-700 disabled:opacity-50",
    check: "text-white",
    spinner: "text-slate-600 peer-checked:text-white",
  },
  light: {
    root: "",
    input:
      "bg-slate-200 border-slate-300 enabled:hover:border-slate-400 checked:border-transparent checked:bg-context-300 checked:enabled:hover:border-context-400 disabled:opacity-50",
    check: "text-context-600 peer-checked:peer-disabled:opacity-50",
    spinner: "text-slate-600 peer-checked:text-white",
  },
  outline: {
    root: "",
    input: "checked:bg-transparent border-context-500 enabled:hover:border-context-700 disabled:opacity-25",
    check: "text-context-500 peer-enabled:peer-hover:text-context-700 peer-checked:peer-disabled:opacity-25",
    spinner: "text-context-500",
  },
  white: {
    root: "",
    input: "bg-white border-slate-300 disabled:opacity-50",
    check: "text-context-600 peer-checked:peer-disabled:opacity-50",
    spinner: "text-context-600",
  },
  none: {
    root: "",
    input: "",
    check: "",
    spinner: "",
  },
};

type CheckboxProps = {
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
    check?: string;
    spinner?: string;
  };
};

export const CheckboxDefaultProps = {
  variant: "filled",
  color: "slate",
  radius: "sm",
  size: "md",
  shadow: "none",
  transition: "normal",
  disabled: false,
  loading: false,
} satisfies CheckboxProps;

export const Checkbox = fr<CheckboxProps, typeof AriakitCheckbox>(
  (
    {
      variant = CheckboxDefaultProps.variant,
      color = CheckboxDefaultProps.color,
      radius = CheckboxDefaultProps.radius,
      size = CheckboxDefaultProps.size,
      shadow = CheckboxDefaultProps.shadow,
      transition = CheckboxDefaultProps.transition,

      disabled = CheckboxDefaultProps.disabled,
      loading = CheckboxDefaultProps.loading,
      classes,
      ...props
    },
    ref,
  ) => (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        variants[variant].root,
        contextColors[color],
        classes?.root,
      )}
    >
      <AriakitCheckbox
        ref={ref}
        clickOnEnter={true}
        {...props}
        disabled={disabled}
        className={cn(
          "peer appearance-none inline-block w-[1em] h-[1em] cursor-pointer",
          "border border-transparent",
          variants[variant].input,
          radii[radius],
          shadows[shadow],
          transitions[transition],
          fontSizes[size],
          classes?.input,
          props.className,
        )}
      />

      <div
        className={cn(
          "absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          loading ? "opacity-0" : "opacity-0 peer-checked:opacity-100",
          variants[variant].check,
          transitions[transition],
          fontSizes[size],
          classes?.check,
        )}
        role="presentation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.8em"
          height="0.8em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {loading && (
        <div
          className={cn(
            "absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            loading ? "opacity-100" : "opacity-0",
            variants[variant].spinner,
            transitions[transition],
            fontSizes[size],
            classes?.spinner,
          )}
          role="presentation"
        >
          ...
        </div>
      )}
    </div>
  ),
);
