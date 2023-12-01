import { useLocalStorage, StorageProperties } from "~/hooks";

import { languages, LanguageCode } from "./languages";

const useSetting = <T>(key: string, defaultValue: T, options?: Omit<StorageProperties<T>, "key" | "defaultValue">) =>
  useLocalStorage<T>({ key, defaultValue, ...options });

export const useSettings = () => {
  /* speech */
  const [speech, setSpeech] = useSetting("gtf:speech", false);

  /* timer */
  const [timer, setTimer] = useSetting("gtf:timer", false);

  /* sound */
  const [sound, setSound] = useSetting("gtf:sound", true);

  /* lang(uage) */
  const [_lang, setLang] = useSetting<LanguageCode>("gtf:lang", "en-US");
  const langProps = Object.values(languages).find(({ code }) => code === _lang);
  const lang = langProps ?? languages["en-US"];

  return { speech, setSpeech, timer, setTimer, sound, setSound, lang, setLang };
};
