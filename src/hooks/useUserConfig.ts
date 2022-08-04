import { useLocalStorage } from "@mantine/hooks";

const serialize = (b: boolean) => (b ? "true" : "false");
const deserialize = (b: "true" | "false") => (b === "true" ? true : false);

const useBooleanLocalStorage = (key: string, defaultValue: boolean) =>
  useLocalStorage<boolean>({
    key,
    defaultValue,
    serialize,
    deserialize,
  });

export const useUserConfig = () => {
  const [speech, setSpeech] = useBooleanLocalStorage("gtf:speech", false);
  const [timer, setTimer] = useBooleanLocalStorage("gtf:timer", false);

  return { speech, setSpeech, timer, setTimer };
};
