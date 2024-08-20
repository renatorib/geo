import React from "react";

import SpeechRecognition, { SpeechRecognitionOptions, useSpeechRecognition } from "react-speech-recognition";

import { useSettings } from "~/features/settings";
import { createStore } from "~/lib/react";

import { playSound } from "../sounds";

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

  commands?: SpeechRecognitionOptions["commands"];
};

const metaStore = createStore<string | number | undefined>(undefined);

export function useTranscripter(props: UseTranscripterProps) {
  const meta = metaStore.useState();
  const settings = useSettings();
  const [started, setStarted] = React.useState(false);

  const { language = settings.lang.code, enabled = true, onTranscript } = props;
  const { transcript, listening, resetTranscript, isMicrophoneAvailable, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands: props.commands });

  const shouldUseSpeech = browserSupportsSpeechRecognition && isMicrophoneAvailable && enabled && settings.speech;

  const start = (meta?: string | number) => {
    if (shouldUseSpeech) {
      SpeechRecognition.startListening({ language });
      metaStore.setState(meta);
    }
  };

  const stop = () => {
    if (shouldUseSpeech) {
      SpeechRecognition.stopListening();
      metaStore.setState(undefined);
    }
  };

  React.useEffect(() => {
    if (listening) {
      setStarted(true);
      playSound("in", { volume: 0.5 });
    } else if (listening === false && started === true) {
      setStarted(false);
      playSound("out", { volume: 0.5 });
    }
  }, [listening, started]);

  React.useEffect(() => {
    if (shouldUseSpeech && transcript) {
      onTranscript?.(transcript);
    }
  }, [transcript, shouldUseSpeech]); // eslint-disable-line

  return { meta, shouldUseSpeech, start, stop, transcript, resetTranscript, listening };
}
