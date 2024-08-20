import React from "react";

import { RiVolumeUpLine } from "react-icons/ri";
import { useSpeechRecognition } from "react-speech-recognition";

import { Dialog } from "~/components/ui/Dialog";
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
      open={show && !!message}
      modal={false}
      backdrop={false}
      className="w-[300px] shadow-none text-white border-none bg-black/100 inset-[none] bottom-10 left-3 right-3"
    >
      <div className="flex items-center gap-2">
        <RiVolumeUpLine className="shrink-0" />
        <span className="text-lg">{message}</span>
      </div>
    </Dialog>
  );
};
