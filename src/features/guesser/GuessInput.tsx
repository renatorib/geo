import React from "react";

import { Autocomplete, ComboboxItem, Input, useCombobox } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { MicOn, Recorder, useTranscripter } from "~/features/speech-recognition";
import { onNextPaint, setInputValue } from "~/lib/dom";
import { normalizeString } from "~/lib/string";
import { cn } from "~/lib/styles";

type GuessInputProps = {
  id: string;
  name: string;
  onGuess: (text: string) => void;
  status?: "correct" | "spoiler" | "hidden";
  transcriptor?: boolean;
  autoComplete?: string[];
  onChange?: (value: string) => any;
} & Omit<React.ComponentProps<typeof Input<"input">>, "autoComplete" | "onChange">;

export const GUESS_INPUT_ID_PROP = "data-guess-input-id";
export const GUESS_INPUT_STATUS_PROP = "data-guess-input-status";

export const GuessInput = ({
  id,
  name,
  status = "hidden",
  transcriptor = true,
  onGuess,
  ...props
}: GuessInputProps) => {
  const { lang } = useSettings();
  const combobox = useCombobox();
  (window as any).combobox = combobox;

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
    [GUESS_INPUT_ID_PROP]: id,
    [GUESS_INPUT_STATUS_PROP]: status,
    leftSection: icon,
    rightSection: showRecorder && <div style={{ width: 34 }} />,
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
    <div className="relative w-full">
      {showRecorder && (
        <div className="absolute right-1 bottom-1 z-10">
          <Recorder
            recording={transcripter.listening && transcripter.meta === id}
            disabled={transcripter.listening && transcripter.meta !== id}
            onClick={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
          />
        </div>
      )}

      {props.autoComplete ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (combobox.dropdownOpened) {
              combobox.clickSelectedOption();
            }
          }}
        >
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
        </form>
      ) : (
        <Input<"input"> key={status} {...inputProps} />
      )}
    </div>
  );
};

GuessInput.getByStatus = (status: string) => {
  return document.querySelector<HTMLInputElement>(`[${GUESS_INPUT_STATUS_PROP}="${status}"]`);
};

GuessInput.getById = (id: string | number) => {
  return document.querySelector<HTMLInputElement>(`[${GUESS_INPUT_ID_PROP}="${id}"]`);
};

GuessInput.clearById = (id: string | number) => {
  return setInputValue(GuessInput.getById(id), "");
};

GuessInput.focusById = (id: string | number) => {
  GuessInput.getById(id)?.focus();
};

GuessInput.blurById = (id: string | number) => {
  GuessInput.getById(id)?.blur();
};
