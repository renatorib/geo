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
