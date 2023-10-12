import React from "react";
import { Box, Card, Input, useMantineTheme } from "@mantine/core";
import { RiCheckLine, RiEyeLine } from "react-icons/ri";
import { MicOn } from "~/features/speech-recognition";
import { useLang } from "~/features/i18n";

export type QuizCardProps = {
  id: string;
  name: string;
  status: "correct" | "spoiler" | "idle";
  listening?: boolean;
  children?: React.ReactNode;
  onGuess: (text: string) => void;
};

export const QuizCard = ({ id, name, status, onGuess, listening, children }: QuizCardProps) => {
  const theme = useMantineTheme();
  const { lang, langs } = useLang();
  const [focused, setFocused] = React.useState(false);

  const color = status === "correct" ? theme.colors.green : status === "spoiler" ? theme.colors.red : [];
  const censored = status === "idle";

  const icon =
    listening && focused ? (
      <MicOn />
    ) : status === "correct" ? (
      <RiCheckLine />
    ) : status === "spoiler" ? (
      <RiEyeLine />
    ) : null;

  return (
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
            placeholder={`Type your guess in ${langs[lang].name}...`}
            onChange={(e) => onGuess(e.target.value)}
            readOnly={!censored}
            disabled={!censored}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
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
  );
};
