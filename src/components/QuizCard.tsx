import React from "react";

import { Box, Card } from "@mantine/core";

import { QuizInput } from "./QuizInput";

export type QuizCardProps = {
  id: string;
  name: string;
  status: "correct" | "spoiler" | "hidden";
  showInput?: boolean;
  children?: React.ReactNode;
  onGuess: (text: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => any;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => any;
};

export const QuizCard = ({ id, name, status, showInput = true, children, onGuess, onFocus, onBlur }: QuizCardProps) => {
  const [focused, setFocused] = React.useState(false);

  const color = status === "correct" ? "green" : status === "spoiler" ? "red" : focused ? "violet" : "gray";
  const getColor = (level: number) => `var(--mantine-color-${color}-${level})`;

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <Box
        data-quiz-card-id={id}
        data-quiz-card-status={status}
        onClick={() => QuizInput.focusInputById(id)}
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
          {children && <Card.Section className="rounded overflow-hidden">{children}</Card.Section>}

          {showInput && (
            <Card.Section pt={4}>
              <QuizInput
                id={id}
                name={name}
                onGuess={onGuess}
                status={status}
                onFocus={(e) => {
                  setFocused(true);
                  onFocus?.(e);
                }}
                onBlur={(e) => {
                  setFocused(false);
                  onBlur?.(e);
                }}
              />
            </Card.Section>
          )}
        </Card>
      </Box>
    </Box>
  );
};
