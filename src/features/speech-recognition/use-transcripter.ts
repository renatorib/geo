import React from "react";

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { useSettings } from "~/features/settings";
import { createStore } from "~/lib/react";

type UseTranscripterProps = {
  /**
   * Language to help speech recognition identifies the transcript
   * @default settings.lang.code
   */
  language?: string;
  /**
   * Disable transcripter by setting to false.
   * @default true
   */
  enabled?: boolean;
  /**
   * Callback fired when a new transcript was captured (transcript changes).
   */
  onTranscript?: (t: string) => any;
};

const metaStore = createStore<string | number | undefined>(undefined);

export function useTranscripter(props: UseTranscripterProps) {
  const meta = metaStore.useState();
  const settings = useSettings();

  const { language = settings.lang.code, enabled = true, onTranscript } = props;
  const { transcript, listening, isMicrophoneAvailable, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const shouldUseSpeech = browserSupportsSpeechRecognition && isMicrophoneAvailable && enabled && settings.speech;

  const start = (id?: string | number) => {
    if (shouldUseSpeech) {
      SpeechRecognition.startListening({ language });
      metaStore.setState(id);
    }
  };

  const stop = () => {
    if (shouldUseSpeech) {
      SpeechRecognition.stopListening();
      metaStore.setState(undefined);
    }
  };

  React.useEffect(() => {
    if (shouldUseSpeech && transcript) {
      onTranscript?.(transcript);
    }
  }, [transcript, shouldUseSpeech]); // eslint-disable-line

  return { meta, shouldUseSpeech, start, stop, transcript, listening };
}
