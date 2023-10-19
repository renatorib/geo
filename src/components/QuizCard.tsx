import React from "react";

import { Box, Card, Input } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { MicOn, Recorder, useTranscripter } from "~/features/speech-recognition";
import { cn } from "~/styles";

export type QuizCardProps = {
  id: string;
  name: string;
  status: "correct" | "spoiler" | "idle";
  children?: React.ReactNode;
  onGuess: (text: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => any;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => any;
};

export const QuizCard = ({ id, name, status, children, onGuess, onFocus, onBlur }: QuizCardProps) => {
  const { lang } = useSettings();
  const [focused, setFocused] = React.useState(false);

  const transcripter = useTranscripter({
    onTranscript: (text) => {
      transcripter.meta === id && onGuess(text);
    },
  });

  const color = status === "correct" ? "green" : status === "spoiler" ? "red" : focused ? "violet" : "gray";
  const getColor = (level: number) => `var(--mantine-color-${color}-${level})`;
  const censored = status === "idle";

  const icon =
    transcripter.listening && transcripter.meta === id ? (
      <MicOn />
    ) : status === "correct" ? (
      <RiCheckLine />
    ) : status === "spoiler" ? (
      <RiEyeLine />
    ) : null;

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      {transcripter.shouldUseSpeech && status === "idle" && (
        <Box style={{ position: "absolute", right: 12, bottom: 12, zIndex: 20 }}>
          <Recorder
            recording={transcripter.listening && transcripter.meta === id}
            disabled={transcripter.listening && transcripter.meta !== id}
            onClick={transcripter.listening ? () => transcripter.stop() : () => transcripter.start(id)}
          />
        </Box>
      )}

      <Box
        component={status !== "idle" ? "div" : "label"}
        data-quiz-card-id={id}
        data-quiz-card-status={status}
        style={{ width: "100%" }}
      >
        <Card
          withBorder
          p="lg"
          radius="md"
          shadow={focused ? "xl" : undefined}
          style={{
            backgroundColor: status === "correct" ? getColor(3) : getColor(1),
            borderColor: status === "correct" ? getColor(6) : getColor(3),
            transition: "all 150ms ease-out",
          }}
        >
          {children && <Card.Section>{children}</Card.Section>}

          <Card.Section pt={4}>
            <Input<"input">
              leftSection={icon}
              value={censored ? undefined : name}
              title={censored ? undefined : name}
              placeholder={`Type your guess in ${lang.name}...`}
              onChange={(e) => onGuess(e.target.value)}
              readOnly={!censored}
              disabled={!censored}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              style={{
                "--color-9": getColor(9),
              }}
              classNames={{
                section: cn("text-[var(--color-9)] text-[1.33em]"),
                input: cn(
                  "w-full border-0 text-ellipsis",
                  "disabled:text-black disabled:bg-transparent",
                  "disabled:border-0 disabled:opacity-1 disabled:cursor-default",
                ),
              }}
            />
          </Card.Section>
        </Card>
      </Box>
    </Box>
  );
};
