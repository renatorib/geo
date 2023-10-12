import { useLocalStorage } from "@mantine/hooks";

import * as flags from "~/data-sources/countries/flags";

const langs = {
  "en-US": {
    code: "en-US" as const,
    property: "en" as const,
    name: "English (US)",
    flag: flags.US,
  },
  "pt-BR": {
    code: "pt-BR" as const,
    property: "pt" as const,
    name: "Português (BR)",
    flag: flags.BR,
  },
};

export type Lang = keyof typeof langs;
export type Property = (typeof langs)[Lang]["property"];

const DEFAULT_LANG: Lang = "en-US";
const DEFAULT_PROPERTY: Property = "en";

export const useLang = () => {
  const [_lang, setLang] = useLocalStorage<Lang>({ key: "gtf:lang", defaultValue: "en-US" });
  const langProps = Object.values(langs).find((l) => l.code === _lang);

  const lang: Lang = langProps?.code ?? DEFAULT_LANG;
  const property: Property = langProps?.property ?? DEFAULT_PROPERTY;

  return {
    lang,
    property,
    setLang,
    langs,
  };
};
