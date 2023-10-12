import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { usePooling } from "~/hooks";
import { useLang } from "~/features/i18n";

type UseTranscripterProps = {
  /**
   * Language to help speech recognition identifies the transcript
   */
  lang?: string;
  /**
   * Disable transcripter by setting to false.
   * @default true
   */
  enabled?: boolean;
  /**
   * Toggle listening by changing active from false to true and vice-versa.
   * @default false
   */
  active?: boolean;
  /**
   * Callback fired when a new transcript was captured (transcript changes).
   */
  onTranscript?: (t: string) => any;
};

/**
 * Toggle start and stop listening based on `active` prop and fires `onTrascript` every time transcript changes.
 * Disable it entirely passing `enabled=false`
 */
export function useTranscripter(props: UseTranscripterProps) {
  const { lang: currentLang } = useLang();
  const { lang = currentLang, enabled = true, active = false, onTranscript } = props;

  const { transcript, listening, isMicrophoneAvailable, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const shouldUseSpeech = browserSupportsSpeechRecognition && isMicrophoneAvailable && enabled;

  const startListening = () => {
    if (shouldUseSpeech && !listening) {
      SpeechRecognition.startListening({ language: lang });
    }
  };

  const stopListening = () => {
    if (shouldUseSpeech || listening) {
      SpeechRecognition.stopListening();
    }
  };

  usePooling(() => {
    if (shouldUseSpeech && active && !listening) {
      startListening();
    } else if (shouldUseSpeech && listening && !active) {
      stopListening();
    }
  }, 100);

  React.useEffect(() => {
    if (shouldUseSpeech && transcript && active) {
      onTranscript?.(transcript);
    }
  }, [transcript, active, shouldUseSpeech]); // eslint-disable-line

  return { shouldUseSpeech, startListening, stopListening, transcript, listening };
}
