import * as flags from "~/data-sources/countries/flags";

export const languages = {
  "en-US": {
    code: "en-US",
    property: "en",
    name: "English (US)",
    flag: flags.US,
    emoji: "🇺🇸",
  },
  "pt-BR": {
    code: "pt-BR",
    property: "pt",
    name: "Português (BR)",
    flag: flags.BR,
    emoji: "🇧🇷",
  },
} as const;

export type LanguageCode = keyof typeof languages;
export type LanguageProperty = (typeof languages)[LanguageCode]["property"];
