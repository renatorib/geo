import { useLocalStorage } from "@mantine/hooks";

import { languages, LanguageCode } from "./languages";

const useBooleanLocalStorage = (key: string, defaultValue: boolean) =>
  useLocalStorage<boolean>({
    key,
    defaultValue,
    serialize: (b) => (b ? "true" : "false"),
    deserialize: (b: "true" | "false") => (b === "true" ? true : false),
  });

export const useSettings = () => {
  /* speech */
  const [speech, setSpeech] = useBooleanLocalStorage("gtf:speech", false);

  /* timer */
  const [timer, setTimer] = useBooleanLocalStorage("gtf:timer", false);

  /* sound */
  const [sound, setSound] = useBooleanLocalStorage("gtf:sound", true);

  /* lang(uage) */
  const [_lang, setLang] = useLocalStorage<LanguageCode>({ key: "gtf:lang", defaultValue: "en-US" });
  const langProps = Object.values(languages).find(({ code }) => code === _lang);
  const lang = langProps ?? languages["en-US"];

  return { speech, setSpeech, timer, setTimer, sound, setSound, lang, setLang };
};
