import React from "react";

import { Box, Input } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { MicOn, Recorder, useTranscripter } from "~/features/speech-recognition";
import { cn } from "~/styles";

type QuizInputProps = {
  id: string;
  name: string;
  onGuess: (text: string) => void;
  status?: "correct" | "spoiler" | "hidden";
  transcriptor?: boolean;
} & React.ComponentProps<typeof Input<"input">>;

export const QUIZ_INPUT_ID_PROP = "data-quiz-input-id";
export const QUIZ_INPUT_STATUS_PROP = "data-quiz-input-status";

export const QuizInput = ({ id, name, status = "hidden", transcriptor = true, onGuess, ...props }: QuizInputProps) => {
  const { lang } = useSettings();

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

      <Input<"input">
        {...{
          [QUIZ_INPUT_ID_PROP]: id,
          [QUIZ_INPUT_STATUS_PROP]: status,
        }}
        leftSection={icon}
        rightSection={showRecorder && <Box style={{ width: 34 }} />}
        value={status === "hidden" ? undefined : name}
        title={status === "hidden" ? undefined : name}
        placeholder={`Type your guess in ${lang.name}...`}
        readOnly={status !== "hidden"}
        disabled={status !== "hidden"}
        {...props}
        onChange={(e) => {
          onGuess(e.target.value);
          props.onChange?.(e);
        }}
        classNames={{
          section: cn(
            "text-[var(--mantine-color-gray-9)] text-[1.33em]",
            typeof props.classNames !== "function" && props.classNames?.section,
          ),
          input: cn(
            "w-full border-0 text-ellipsis",
            "disabled:text-black disabled:bg-transparent",
            "disabled:border-0 disabled:opacity-1 disabled:cursor-default",

            typeof props.classNames !== "function" && props.classNames?.input,
          ),
        }}
      />
    </Box>
  );
};

QuizInput.getInputById = (id: string | number) => {
  return document.querySelector<HTMLInputElement>(`[${QUIZ_INPUT_ID_PROP}="${id}"]`);
};

QuizInput.clearInputById = (id: string | number) => {
  const input = QuizInput.getInputById(id);
  if (input) {
    input.value = "";
  }
};

QuizInput.getInputByStatus = (status: string) => {
  return document.querySelector<HTMLInputElement>(`[${QUIZ_INPUT_STATUS_PROP}="${status}"]`);
};
