import React from "react";

import { Box, Dialog, Text } from "@mantine/core";
import { RiVolumeUpLine } from "react-icons/ri";
import { useSpeechRecognition } from "react-speech-recognition";

import { usePrevious } from "~/hooks";

export const TranscriptDialog = () => {
  const [show, setShow] = React.useState(false);
  const { transcript } = useSpeechRecognition();
  const prevTranscript = usePrevious(transcript);
  const dismissTimeout = React.useRef<NodeJS.Timeout>();
  const message = transcript || prevTranscript;

  React.useEffect(() => {
    setShow(true);
    clearTimeout(dismissTimeout.current);
    dismissTimeout.current = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(dismissTimeout.current);
  }, [transcript]);

  return (
    <Dialog
      opened={show && !!message}
      position={{ top: 20, left: "calc(50vw - 150px)" }}
      transitionProps={{ transition: "slide-down" }}
      styles={{
        root: {
          width: 300,
          textAlign: "center",
          boxShadow: "none",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
        },
      }}
    >
      <Box style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <RiVolumeUpLine style={{ flexShrink: "0" }} />
        <Text size="lg">{message}</Text>
      </Box>
    </Dialog>
  );
};
