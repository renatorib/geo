import React from "react";

import { Box, Card, Input, useMantineTheme } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { MicOn, Recorder, useTranscripter } from "~/features/speech-recognition";

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
  const theme = useMantineTheme();
  const { lang } = useSettings();
  const [focused, setFocused] = React.useState(false);

  const transcripter = useTranscripter({
    onTranscript: (text) => {
      transcripter.meta === id && onGuess(text);
    },
  });

  const color = status === "correct" ? theme.colors.green : status === "spoiler" ? theme.colors.red : [];
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
    <Box sx={{ position: "relative", width: "100%" }}>
      {transcripter.shouldUseSpeech && status !== "correct" && (
        <Box sx={{ position: "absolute", right: 12, bottom: 12, zIndex: 20 }}>
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
        sx={{ width: "100%" }}
      >
        <Card
          withBorder
          p="lg"
          radius="md"
          shadow={focused ? "lg" : undefined}
          sx={(t) => ({
            outline: focused ? `1px solid ${t.colors.blue[9]}` : undefined,
          })}
        >
          {children && <Card.Section sx={{ backgroundColor: color[2] }}>{children}</Card.Section>}

          <Card.Section sx={{ backgroundColor: color[2] }}>
            <Input<"input">
              icon={icon}
              value={censored ? undefined : name}
              title={censored ? undefined : name}
              placeholder={`Type your guess in ${lang.name}...`}
              onChange={(e) => onGuess(e.target.value)}
              readOnly={!censored}
              disabled={!censored}
              onFocus={(e) => {
                console.log("ON FOCUS");
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                console.log("ON BLUR");
                setFocused(false);
                onBlur?.(e);
              }}
              styles={{
                icon: {
                  color: color[9],
                  fontSize: "1.33em",
                },
                input: {
                  width: `100%`,
                  border: "none",
                  textOverflow: "ellipsis",
                  "&:disabled": {
                    color: color[9],
                    background: "none",
                    border: "none",
                    opacity: 1,
                    cursor: "default",
                  },
                },
              }}
            />
          </Card.Section>
        </Card>
      </Box>
    </Box>
  );
};
