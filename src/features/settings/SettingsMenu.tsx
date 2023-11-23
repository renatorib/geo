import React from "react";

import { Menu, Switch } from "@mantine/core";
import { RiSettings2Line } from "react-icons/ri";

import { ButtonIcon } from "~/components/ui/ButtonIcon";

import { useSpeechRecognition } from "../speech-recognition";

import { useSettings } from "./use-settings";

export const SettingsMenu = () => {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const settings = useSettings();

  return (
    <Menu shadow="md" width={250} position="bottom-end" withArrow>
      <Menu.Target>
        <ButtonIcon radius="full" variant="outline">
          <RiSettings2Line size={20} />
        </ButtonIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <div className="flex items-center w-full justify-between px-3 py-1">
          <Switch
            size="sm"
            checked={settings.speech}
            onChange={(ev) => settings.setSpeech(ev.currentTarget.checked)}
            disabled={!browserSupportsSpeechRecognition}
            label={`Speech ${!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}`}
          />
        </div>
        <div className="flex items-center w-full justify-between px-3 py-1">
          <Switch
            size="sm"
            checked={settings.timer}
            onChange={(ev) => settings.setTimer(ev.currentTarget.checked)}
            label="Show timer"
          />
        </div>
        <div className="flex items-center w-full justify-between px-3 py-1">
          <Switch
            size="sm"
            checked={settings.sound}
            onChange={(ev) => settings.setSound(ev.currentTarget.checked)}
            label="Sound effects"
          />
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};
