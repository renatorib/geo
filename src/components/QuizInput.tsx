import React from "react";

import { Autocomplete, Box, ComboboxItem, Input, useCombobox } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { MicOn, Recorder, useTranscripter } from "~/features/speech-recognition";
import { onNextPaint, setInputValue } from "~/lib/dom";
import { normalizeString } from "~/lib/string";
import { cn } from "~/styles";

type QuizInputProps = {
  id: string;
  name: string;
  onGuess: (text: string) => void;
  status?: "correct" | "spoiler" | "hidden";
  transcriptor?: boolean;
  autoComplete?: string[];
  onChange?: (value: string) => any;
} & Omit<React.ComponentProps<typeof Input<"input">>, "autoComplete" | "onChange">;

export const QUIZ_INPUT_ID_PROP = "data-quiz-input-id";
export const QUIZ_INPUT_STATUS_PROP = "data-quiz-input-status";

export const QuizInput = ({ id, name, status = "hidden", transcriptor = true, onGuess, ...props }: QuizInputProps) => {
  const { lang } = useSettings();

  // const [comboboxOpened, setComboboxOpened] = React.useState(false);
  const combobox = useCombobox();

  const transcripter = useTranscripter({
    enabled: transcriptor,
    onTranscript: (text) => {
      transcripter.meta === id && onGuess(text);
    },
  });

  const icon =
    transcripter.listening && transcripter.meta === id ? (
      <MicOn />
    ) : status === "correct" ? (
      <RiCheckLine />
    ) : status === "spoiler" ? (
      <RiEyeLine />
    ) : null;

  const showRecorder = transcripter.shouldUseSpeech && status === "hidden";

  const handleChange = (value: string) => {
    if (value.length < 2) {
      combobox.closeDropdown();
      return;
    }
    combobox.openDropdown();
    onNextPaint(() => combobox.selectFirstOption());
    onGuess(value);
    props.onChange?.(value);
  };

  const inputProps = {
    [QUIZ_INPUT_ID_PROP]: id,
    [QUIZ_INPUT_STATUS_PROP]: status,
    leftSection: icon,
    rightSection: showRecorder && <Box style={{ width: 34 }} />,
    title: status === "hidden" ? undefined : name,
    placeholder: `Type your guess in ${lang.emoji} (${lang.code})`,

    value: status === "hidden" ? undefined : name,
    readOnly: status !== "hidden",
    disabled: status !== "hidden",

    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => {
      handleChange(typeof e === "string" ? e : e.target.value);
    },
    classNames: {
      section: cn(
        "text-[var(--mantine-color-gray-9)] text-[1.33em]",
        typeof props.classNames !== "function" && props.classNames?.section,
      ),
      input: cn(
        "w-full border-0 text-ellipsis",
        "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-400",
        "disabled:text-black disabled:bg-transparent",
        "disabled:border-0 disabled:opacity-1 disabled:cursor-default",

        typeof props.classNames !== "function" && props.classNames?.input,
      ),
    },
  };

  return (
    <Box className="relative w-full">
      {showRecorder && (
        <Box style={{ position: "absolute", right: 3, bottom: 3, zIndex: 1 }}>
          <Recorder
            recording={transcripter.listening && transcripter.meta === id}
            disabled={transcripter.listening && transcripter.meta !== id}
            onClick={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
          />
        </Box>
      )}

      {props.autoComplete ? (
        <Autocomplete
          data={props.autoComplete}
          {...inputProps}
          comboboxProps={{ store: combobox }}
          filter={(input) =>
            (input.options as ComboboxItem[]).filter((option) =>
              normalizeString(option.value).startsWith(normalizeString(input.search)),
            )
          }
        />
      ) : (
        <Input<"input"> {...inputProps} />
      )}
    </Box>
  );
};

QuizInput.getInputByStatus = (status: string) => {
  return document.querySelector<HTMLInputElement>(`[${QUIZ_INPUT_STATUS_PROP}="${status}"]`);
};

QuizInput.getInputById = (id: string | number) => {
  return document.querySelector<HTMLInputElement>(`[${QUIZ_INPUT_ID_PROP}="${id}"]`);
};

QuizInput.clearInputById = (id: string | number) => {
  return setInputValue(QuizInput.getInputById(id), "");
};

QuizInput.focusInputById = (id: string | number) => {
  QuizInput.getInputById(id)?.focus();
};
