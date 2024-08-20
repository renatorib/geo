import React from "react";

import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";

import { useSettings } from "~/features/settings";
import { Recorder, useTranscripter } from "~/features/speech-recognition";
import { setInputValue } from "~/lib/dom";
import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

type GuessInputProps = {
  onGuess: (text: string) => boolean;
  status?: "correct" | "spoiler" | "hidden";
  id?: string;
  transcriptor?: boolean;
  autocomplete?: string[];
  onNext?: () => any;
  onPrev?: () => any;
} & Partial<Omit<React.ComponentProps<typeof Autocomplete>, "autoComplete">>;

export const GUESS_INPUT_ID_PROP = "data-guess-input-id";
export const GUESS_INPUT_STATUS_PROP = "data-guess-input-status";

export const GuessInput = ({
  onGuess,
  status = "hidden",
  id = "guess-input",
  transcriptor = true,
  autocomplete,
  onNext,
  onPrev,
  ...restProps
}: GuessInputProps) => {
  const { lang } = useSettings();

  const transcripter = useTranscripter({
    enabled: transcriptor,
    onTranscript: (text) => {
      if (transcripter.meta === id) {
        if (/(skip|next|pula|pr[óo]xim[oa])/gi.test(text) && onNext) {
          onNext();
          transcripter.resetTranscript();
          setTimeout(() => transcripter.start(id), 50);
        }

        if (/(back|beck|previous|volta|anterior)/gi.test(text) && onPrev) {
          onPrev();
          transcripter.resetTranscript();
          setTimeout(() => transcripter.start(id), 50);
        }

        if (onGuess(text)) {
          transcripter.resetTranscript();
          setTimeout(() => transcripter.start(id), 50);
        } else {
          transcripter.resetTranscript();
          setTimeout(() => transcripter.start(id), 50);
        }
      }
    },
  });

  const showRecorder = transcripter.shouldUseSpeech && status === "hidden";

  const handleChange = (value: string) => {
    onGuess(value);
    restProps.onChange?.(value);
  };

  const right = showRecorder && (
    <Recorder
      recording={transcripter.listening && transcripter.meta === id}
      disabled={transcripter.listening && transcripter.meta !== id}
      onRecord={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
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
        right={right}
        items={autocomplete ? [...new Set(autocomplete)] : []}
        placeholder={`Type your guess in ${lang.emoji} (${lang.code})`}
        disabled={status !== "hidden"}
        readOnly={status !== "hidden"}
        onChange={handleChange}
        className={cn(
          "w-full border-0 text-ellipsis",
          "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-400",
          "disabled:text-black disabled:bg-transparent",
          "disabled:border-0 disabled:opacity-1 disabled:cursor-default",
        )}
        {...restProps}
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

  React.useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <Ariakit.ComboboxProvider open={open} value={value} setValue={setValue}>
      <div className="flex items-center">
        {left && <div className="px-1">{left}</div>}
        <Ariakit.Combobox
          ref={ref}
          autoSelect
          {...comboboxProps}
          className={cn("p-2 w-full rounded", comboboxProps.className)}
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
          "flex flex-col overflow-auto overscroll-contain rounded p-2 bg-white",
          "shadow border border-solid border-slate-300",
        )}
      >
        {open &&
          matches.map((value) => (
            <Ariakit.ComboboxItem
              key={value}
              value={value}
              className={cn(
                "flex items-center gap-2 rounded p-2 outline-none scroll-m-2",
                "cursor-pointer hover:bg-slate-200",
                "data-[active-item]:bg-blue-500 data-[active-item]:text-white",
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
