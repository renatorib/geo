import React from "react";

import { Box, Input } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { MicOn, Recorder, useTranscripter } from "~/features/speech-recognition";
import { cn } from "~/styles";

type QuizInputProps = {
  id: string;
  name: string;
  status: "correct" | "spoiler" | "hidden";
  transcriptor?: boolean;
  onGuess: (text: string) => void;
} & React.ComponentProps<typeof Input<"input">>;

export const QuizInput = ({ id, name, status, transcriptor = true, onGuess, ...props }: QuizInputProps) => {
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
        <Box style={{ position: "absolute", right: 1, bottom: 1, zIndex: 1 }}>
          <Recorder
            recording={transcripter.listening && transcripter.meta === id}
            disabled={transcripter.listening && transcripter.meta !== id}
            onClick={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
          />
        </Box>
      )}

      <Input<"input">
        data-quiz-input-id={id}
        data-quiz-input-status={status}
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
