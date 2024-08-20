import React from "react";

import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";

import { LangSelectorMenu, useSettings } from "~/features/settings";
import { Recorder, useTranscripter } from "~/features/speech-recognition";
import { setInputValue } from "~/lib/dom";
import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

type GuessInputProps = {
  onGuess: (text: string) => void;
  status?: "correct" | "spoiler" | "hidden";
  id?: string;
  transcriptor?: boolean;
  autocomplete?: string[];
} & Partial<Omit<React.ComponentProps<typeof Autocomplete>, "autoComplete">>;

export const GUESS_INPUT_ID_PROP = "data-guess-input-id";
export const GUESS_INPUT_STATUS_PROP = "data-guess-input-status";

export const GuessInput = ({
  onGuess,
  status = "hidden",
  id = "guess-input",
  transcriptor = true,
  autocomplete,
  ...restProps
}: GuessInputProps) => {
  const transcripter = useTranscripter({
    enabled: transcriptor,
    onTranscript: (text) => {
      transcripter.meta === id && onGuess(text);
    },
  });

  const showRecorder = transcripter.shouldUseSpeech && status === "hidden";

  const handleChange = (value: string) => {
    onGuess(value);
    restProps.onChange?.(value);
  };

  const recorder = showRecorder && (
    <Recorder
      recording={transcripter.listening && transcripter.meta === id}
      disabled={transcripter.listening && transcripter.meta !== id}
      onClick={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
      className="-mr-2 -ml-1"
    />
  );

  const dataAttrs = {
    [GUESS_INPUT_ID_PROP]: id,
    [GUESS_INPUT_STATUS_PROP]: status,
  };

  return (
    <div className="relative w-full">
      <Autocomplete
        {...dataAttrs}
        left={recorder}
        right={
          <div className="light">
            <LangSelectorMenu />
          </div>
        }
        items={autocomplete ? [...new Set(autocomplete)] : []}
        placeholder={`Type your guess...`}
        disabled={status !== "hidden"}
        readOnly={status !== "hidden"}
        onChange={handleChange}
        {...restProps}
        className={cn(restProps.className)}
      />
    </div>
  );
};

const Autocomplete = fr<
  { items: string[]; onChange: (value: string) => any; left?: React.ReactNode; right?: React.ReactNode },
  typeof Ariakit.Combobox
>(({ items, onChange, left, right, ...comboboxProps }, ref) => {
  const [value, setValue] = React.useState("");
  const matches = React.useMemo(
    () =>
      value.length >= 2
        ? matchSorter(items, value, {
            keys: [(item) => item.replace(/-/g, " ")],
          })
        : [],
    [value],
  );

  const open = matches.length >= 1;
  const dim = false;

  return (
    <Ariakit.ComboboxProvider
      open={open}
      value={value}
      setValue={(value) => {
        setValue(value);
        onChange(value);
      }}
    >
      <div
        className={cn(
          "group flex items-center bg-stone-200 transition-colors rounded px-2",
          dim && "backdrop-blur-sm bg-stone-200/20 focus-within:bg-stone-200",
        )}
      >
        {left && <div className="px-1">{left}</div>}
        <Ariakit.Combobox
          ref={ref}
          autoSelect
          {...comboboxProps}
          className={cn(
            "p-3 w-full rounded text-stone-800",
            "w-full border-0 text-ellipsis",
            "focus:outline-0 bg-transparent placeholder:text-stone-500",
            "disabled:text-black disabled:bg-transparent",
            "disabled:border-0 disabled:opacity-1 disabled:cursor-default",
            comboboxProps.className,
          )}
        />
        {right && <div className="px-1">{right}</div>}
      </div>
      <Ariakit.ComboboxPopover
        gutter={8}
        sameWidth
        autoFocusOnShow={true}
        flip={false}
        className={cn(
          "relative max-h-[min(var(--popover-available-height,_300px),_300px)]",
          "flex flex-col overflow-auto overscroll-contain rounded p-2 bg-stone-950",
          "shadow-lg z-50",
        )}
      >
        {matches.map((value) => (
          <Ariakit.ComboboxItem
            key={value}
            value={value}
            className={cn(
              "flex items-center gap-2 rounded p-2 outline-none scroll-m-2",
              "cursor-pointer text-stone-400 hover:bg-stone-800",
              "data-[active-item]:bg-lime-400 data-[active-item]:text-stone-900",
            )}
          />
        ))}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
});

GuessInput.getByStatus = (status: string) => {
  return document.querySelector<HTMLInputElement>(`[${GUESS_INPUT_STATUS_PROP}="${status}"]`);
};

GuessInput.getById = (id: string | number = "guess-input") => {
  return document.querySelector<HTMLInputElement>(`[${GUESS_INPUT_ID_PROP}="${id}"]`);
};

GuessInput.clearById = (id: string | number = "guess-input") => {
  return setInputValue(GuessInput.getById(id), "");
};

GuessInput.focusById = (id: string | number = "guess-input") => {
  GuessInput.getById(id)?.focus();
};

GuessInput.blurById = (id: string | number = "guess-input") => {
  GuessInput.getById(id)?.blur();
};
