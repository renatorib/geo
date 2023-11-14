import React from "react";

import { Dialog } from "@mantine/core";
import { RiVolumeUpLine } from "react-icons/ri";
import { useSpeechRecognition } from "react-speech-recognition";

import { Text } from "~/components/ui/Text";
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
      classNames={{
        root: "w-[300px] text-ce shadow-none text-white border-none bg-black/50",
      }}
    >
      <div className="flex items-center gap-2">
        <RiVolumeUpLine className="shrink-0" />
        <Text size="lg">{message}</Text>
      </div>
    </Dialog>
  );
};
