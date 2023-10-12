import React from "react";
import { Alert, Text } from "@mantine/core";
import { RiMicLine, RiSettings2Line } from "react-icons/ri";

export const SpeechAlert = () => {
  return (
    <Alert color="indigo" title="Speech is enabled!" icon={<RiMicLine />}>
      <Text color="dimmed">
        When you see <RiMicLine color="red" style={{ verticalAlign: "middle", display: "inline-flex" }} /> icon, it
        means we are listening to your guesses through your microphone. <br /> You can disable speech mode in your
        settings <RiSettings2Line color="black" style={{ verticalAlign: "middle", display: "inline-flex" }} /> located
        at top-right of the header.
      </Text>
    </Alert>
  );
};
