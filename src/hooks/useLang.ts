import { useLocalStorage } from "@mantine/hooks";
import * as flags from "~/countries/flags";

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

type Lang = keyof typeof langs;

const DEFAULT_LANG: Lang = "en-US";
const DEFAULT_PROPERTY = "en";

export const useLang = () => {
  const [_lang, setLang] = useLocalStorage<Lang>({ key: "gtf:lang", defaultValue: "en-US" });
  const langProps = Object.values(langs).find((l) => l.code === _lang);
  const lang = langProps?.code ?? DEFAULT_LANG;
  const property = langProps?.property ?? DEFAULT_PROPERTY;
  return { lang, property, setLang, langs };
};
