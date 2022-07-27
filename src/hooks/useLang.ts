import { useLocalStorage } from "@mantine/hooks";
import * as flags from "~/countries/flags";

const langs = {
  "en-US": {
    code: "en-US" as const,
    name: "English (US)",
    flag: flags.US,
  },
  "pt-BR": {
    code: "pt-BR" as const,
    name: "Português (BR)",
    flag: flags.BR,
  },
};

type Lang = keyof typeof langs;

const DEFAULT_LANG: Lang = "en-US";

export const useLang = () => {
  const [_lang, setLang] = useLocalStorage<Lang>({ key: "gtf:lang", defaultValue: "en-US" });
  const lang = Object.keys(langs).includes(_lang) ? _lang : DEFAULT_LANG;
  return { lang, setLang, langs };
};
