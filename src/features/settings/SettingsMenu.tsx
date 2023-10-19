import React from "react";

import { ActionIcon, Group, Menu, Switch } from "@mantine/core";
import { RiSettings2Line } from "react-icons/ri";

import { useSpeechRecognition } from "../speech-recognition";

import { useSettings } from "./useSettings";

export const SettingsMenu = () => {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const settings = useSettings();

  return (
    <Menu shadow="md" width={250} position="bottom-end" withArrow>
      <Menu.Target>
        <ActionIcon radius="xl" color="dark">
          <RiSettings2Line size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Group px={12} py={6} justify="space-between">
          <Switch
            size="sm"
            checked={settings.speech}
            onChange={(ev) => settings.setSpeech(ev.currentTarget.checked)}
            disabled={!browserSupportsSpeechRecognition}
            label={`Enable speech ${!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}`}
          />
        </Group>
        <Group px={12} py={6} justify="space-between">
          <Switch
            size="sm"
            checked={settings.timer}
            onChange={(ev) => settings.setTimer(ev.currentTarget.checked)}
            label="Show timer"
          />
        </Group>
        <Group px={12} py={6} justify="space-between">
          <Switch
            size="sm"
            checked={settings.sound}
            onChange={(ev) => settings.setSound(ev.currentTarget.checked)}
            label="Enable sound effects"
          />
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};
