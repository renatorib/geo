import classnames, { Argument } from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Argument[]) {
  return twMerge(classnames(inputs));
}

export const contextColors = /* tw */ {
  current: "",
  slate: "color-context-slate",
  gray: "color-context-gray",
  zinc: "color-context-zinc",
  neutral: "color-context-neutral",
  stone: "color-context-stone",
  red: "color-context-red",
  orange: "color-context-orange",
  amber: "color-context-amber",
  yellow: "color-context-yellow",
  lime: "color-context-lime",
  green: "color-context-green",
  emerald: "color-context-emerald",
  teal: "color-context-teal",
  cyan: "color-context-cyan",
  sky: "color-context-sky",
  blue: "color-context-blue",
  indigo: "color-context-indigo",
  violet: "color-context-violet",
  purple: "color-context-purple",
  fuchsia: "color-context-fuchsia",
  pink: "color-context-pink",
  rose: "color-context-rose",
};

export const fontSizes = /* tw */ {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
};

export const fontWeights = /* tw */ {
  100: "font-thin",
  thin: "font-thin",
  200: "font-extralight",
  extralight: "font-extralight",
  300: "font-light",
  light: "font-light",
  400: "font-normal",
  normal: "font-normal",
  500: "font-medium",
  medium: "font-medium",
  600: "font-semibold",
  semibold: "font-semibold",
  700: "font-bold",
  bold: "font-bold",
  800: "font-extrabold",
  extrabold: "font-extrabold",
  900: "font-black",
  black: "font-black",
};

export const radii = /* tw */ {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const paddingsSize = /* tw */ {
  none: "px-0 py-0",
  xs: "px-[0.3em] py-[0.1em]",
  sm: "px-[0.6em] py-[0.2em]",
  md: "px-[0.75em] py-[0.25em]",
  lg: "px-[1em] py-[0.33em]",
  xl: "px-[1.25em] py-[0.4166em]",
  "2xl": "px-[1.5em] py-[0.5em]",
};

export const paddingsSizeSquare = /* tw */ {
  none: "p-0",
  xs: "p-[0.1em]",
  sm: "p-[0.2em]",
  md: "p-[0.25em]",
  lg: "p-[0.33em]",
  xl: "p-[0.4166em]",
  "2xl": "p-[0.5em]",
};

export const paddingsGap = /* tw */ {
  none: "gap-[0.3em]",
  xs: "gap-[0.3em]",
  sm: "gap-[0.6em]",
  md: "gap-[0.75em]",
  lg: "gap-[1em]",
  xl: "gap-[1.25em]",
  "2xl": "gap-[1.5em]",
};

export const paddingsBlock = /* tw */ {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
  xl: "p-5",
  "2xl": "p-6",
};

export const shadows = /* tw */ {
  inner: "shadow-inner",
  none: "",
  xs: "shadow-sm",
  sm: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

export const transitions = /* tw */ {
  none: "transition-none",
  fast: "transition-all duration-75",
  normal: "transition-all duration-150 hover:duration-100",
  slow: "transition-all duration-300 hover:duration-200",
};
