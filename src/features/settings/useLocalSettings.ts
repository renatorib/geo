import { useLocalStorage } from "@mantine/hooks";

const useBooleanLocalStorage = (key: string, defaultValue: boolean) =>
  useLocalStorage<boolean>({
    key,
    defaultValue,
    serialize: (b) => (b ? "true" : "false"),
    deserialize: (b: "true" | "false") => (b === "true" ? true : false),
  });

export const useLocalSettings = () => {
  const [speech, setSpeech] = useBooleanLocalStorage("gtf:speech", false);
  const [timer, setTimer] = useBooleanLocalStorage("gtf:timer", false);

  return { speech, setSpeech, timer, setTimer };
};
