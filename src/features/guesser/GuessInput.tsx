import React from "react";

import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";

import { Input } from "~/components/ui/Input";
import { useSettings } from "~/features/settings";
import { Recorder, useTranscripter } from "~/features/speech-recognition";
import { setInputValue } from "~/lib/dom";
import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

type GuessInputProps = {
  id: string;
  name: string;
  onGuess: (text: string) => void;
  status?: "correct" | "spoiler" | "hidden";
  transcriptor?: boolean;
  autoComplete?: string[];
  onChange?: (value: string) => any;
} & Omit<React.ComponentProps<typeof Input>, "autoComplete" | "onChange">;

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

  const transcripter = useTranscripter({
    enabled: transcriptor,
    onTranscript: (text) => {
      transcripter.meta === id && onGuess(text);
    },
  });

  const showRecorder = transcripter.shouldUseSpeech && status === "hidden";

  const handleChange = (value: string) => {
    onGuess(value);
    props.onChange?.(value);
  };

  const right = showRecorder && (
    <Recorder
      recording={transcripter.listening && transcripter.meta === id}
      disabled={transcripter.listening && transcripter.meta !== id}
      onClick={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
    />
  );

  const inputProps = {
    [GUESS_INPUT_ID_PROP]: id,
    [GUESS_INPUT_STATUS_PROP]: status,
    // title: status === "hidden" ? undefined : name,
    placeholder: `Type your guess in ${lang.emoji} (${lang.code})`,

    value: status === "hidden" ? undefined : name,
    readOnly: status !== "hidden",
    disabled: status !== "hidden",

    right,
    className: cn(
      "w-full border-0 text-ellipsis",
      "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-400",
      "disabled:text-black disabled:bg-transparent",
      "disabled:border-0 disabled:opacity-1 disabled:cursor-default",
    ),
    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => {
      handleChange(typeof e === "string" ? e : e.target.value);
    },
  };

  return (
    <div className="relative w-full">
      {props.autoComplete ? (
        <Autocomplete items={[...new Set(props.autoComplete)]} {...inputProps} right={right} />
      ) : (
        <Input key={status} {...inputProps} right={right} />
      )}
    </div>
  );
};

const Autocomplete = fr<
  { items: string[]; onChange: (value: string) => any; left?: React.ReactNode; right?: React.ReactNode },
  typeof Ariakit.Combobox
>(({ items, onChange, left, right, ...comboboxProps }, ref) => {
  const [value, setValue] = React.useState("");
  const matches = React.useMemo(() => (value.length >= 2 ? matchSorter(items, value) : []), [value]);
  const open = matches.length >= 1;

  const store = Ariakit.useComboboxStore({
    value,
    open,
    setValue: (value) => {
      setValue(value);
      onChange(value);
    },
  });

  const state = store.useState();
  React.useEffect(() => {
    setTimeout(() => store.move(store.first()));
  }, [state.value]);

  return (
    <>
      <div className="flex items-center">
        {left && <div className="px-1">{left}</div>}
        <Ariakit.Combobox
          ref={ref}
          store={store}
          {...comboboxProps}
          className={cn("p-2 w-full rounded", comboboxProps.className)}
        />
        {right && <div className="px-1">{right}</div>}
      </div>
      <Ariakit.ComboboxPopover
        store={store}
        gutter={8}
        sameWidth
        autoFocusOnShow={true}
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
              className="flex items-center gap-2 rounded p-2 outline-none scroll-m-2 hover:bg-slate-200 data-[active-item]:bg-blue-200"
            />
          ))}
      </Ariakit.ComboboxPopover>
    </>
  );
});

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
