import React from "react";

import { Switch } from "@mantine/core";
import { RiSettings2Line } from "react-icons/ri";

import { ButtonIcon } from "~/components/ui/ButtonIcon";
import { Menu } from "~/components/ui/Menu";
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
          <ButtonIcon variant="ghost">
            <RiSettings2Line />
          </ButtonIcon>
        }
      >
        <Menu.Label>Settings</Menu.Label>
        <Switch
          size="sm"
          checked={settings.speech}
          onChange={(ev) => settings.setSpeech(ev.currentTarget.checked)}
          disabled={!browserSupportsSpeechRecognition}
          label={`Speech ${!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}`}
        />
        <Switch
          size="sm"
          checked={settings.timer}
          onChange={(ev) => settings.setTimer(ev.currentTarget.checked)}
          label="Show timer"
        />
        <Switch
          size="sm"
          checked={settings.sound}
          onChange={(ev) => settings.setSound(ev.currentTarget.checked)}
          label="Sound effects"
        />
      </Menu>
    </>
  );
};
