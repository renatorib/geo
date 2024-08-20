import React from "react";

import { RiSettings2Line } from "react-icons/ri";

import { ButtonIcon } from "~/components/ui/ButtonIcon";
import { Menu } from "~/components/ui/Menu";
import { Switch } from "~/components/ui/Switch";
import { useIsMounted } from "~/hooks";

import { useSpeechRecognition } from "../speech-recognition";

import { useSettings } from "./use-settings";

export const SettingsMenu = () => {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const mounted = useIsMounted();
  const settings = useSettings();

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Menu
        target={
          <ButtonIcon variant="ghost" color="stone">
            <RiSettings2Line />
          </ButtonIcon>
        }
      >
        <Menu.Title>Settings</Menu.Title>
        <Menu.Label>
          <Switch
            size="sm"
            color="lime"
            checked={settings.speech}
            onChange={(ev) => settings.setSpeech(ev.currentTarget.checked)}
            disabled={!browserSupportsSpeechRecognition}
          />
          Speech {!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}
        </Menu.Label>
        <Menu.Label>
          <Switch
            size="sm"
            color="lime"
            checked={settings.timer}
            onChange={(ev) => settings.setTimer(ev.currentTarget.checked)}
          />
          Show timer
        </Menu.Label>
        <Menu.Label>
          <Switch
            size="sm"
            color="lime"
            checked={settings.sound}
            onChange={(ev) => settings.setSound(ev.currentTarget.checked)}
          />
          Sound effects
        </Menu.Label>
      </Menu>
    </>
  );
};
