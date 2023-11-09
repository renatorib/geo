import React from "react";

import { Menu } from "@mantine/core";
import { RiCheckLine } from "react-icons/ri";

import { NoSSR } from "~/components/NoSSR";
import { Chevron } from "~/components/ui/Chevron";
import { Flag } from "~/components/ui/Flag";
import { cn } from "~/lib/styles";

import { languages } from "./languages";
import { useSettings } from "./use-settings";

export const LangSelectorMenu = () => {
  const { lang, setLang } = useSettings();
  const [opened, setOpened] = React.useState(false);

  return (
    <NoSSR>
      {() => (
        <Menu opened={opened} onChange={setOpened} shadow="md" width={200} position="bottom-end" withArrow>
          <Menu.Target>
            <button
              className={cn(
                "flex items-center text-gray-900 p-0.5 rounded-sm",
                "hover:bg-gray-200 active:translate-y-0.5",
              )}
            >
              <Flag src={lang.flag} width={18} />
              <Chevron opened={opened} size={14} />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            {Object.values(languages).map((l) => {
              return (
                <Menu.Item
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  leftSection={<Flag src={l.flag} width={20} />}
                  rightSection={l.code === lang.code ? <RiCheckLine size={16} /> : null}
                >
                  {l.name}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </NoSSR>
  );
};
