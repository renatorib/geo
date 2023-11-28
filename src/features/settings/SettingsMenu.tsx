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
          <ButtonIcon variant="ghost">
            <RiSettings2Line />
          </ButtonIcon>
        }
      >
        <Menu.Label>Settings</Menu.Label>
        <label className="flex items-center gap-2 px-0.5 py-1 rounded hover:bg-slate-100">
          <Switch
            size="sm"
            color="green"
            checked={settings.speech}
            onChange={(ev) => settings.setSpeech(ev.currentTarget.checked)}
            disabled={!browserSupportsSpeechRecognition}
          />
          Speech {!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}
        </label>
        <label className="flex items-center gap-2 px-0.5 py-1 rounded hover:bg-slate-100">
          <Switch
            size="sm"
            color="green"
            checked={settings.timer}
            onChange={(ev) => settings.setTimer(ev.currentTarget.checked)}
          />{" "}
          Show timer
        </label>
        <label className="flex items-center gap-2 px-0.5 py-1 rounded hover:bg-slate-100">
          <Switch
            size="sm"
            color="green"
            checked={settings.sound}
            onChange={(ev) => settings.setSound(ev.currentTarget.checked)}
          />
          Sound effects
        </label>
      </Menu>
    </>
  );
};
