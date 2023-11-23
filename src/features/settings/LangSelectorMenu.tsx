import React from "react";

import { RiCheckLine } from "react-icons/ri";

import { NoSSR } from "~/components/NoSSR";
import { ButtonIcon } from "~/components/ui/ButtonIcon";
import { Flag } from "~/components/ui/Flag";
import { Menu } from "~/components/ui/Menu";

import { languages } from "./languages";
import { useSettings } from "./use-settings";

export const LangSelectorMenu = () => {
  const { lang, setLang } = useSettings();

  return (
    <NoSSR>
      {() => (
        <Menu
          className="min-w-[200px]"
          target={
            <ButtonIcon variant="ghost">
              <div className="h-4 w-6 grid place-items-center">
                <Flag src={lang.flag} width={20} />
              </div>
            </ButtonIcon>
          }
        >
          {Object.values(languages).map((l) => {
            const selected = l.code === lang.code;
            return (
              <Menu.Item key={l.code} onClick={() => setLang(l.code)} selected={selected}>
                <Flag src={l.flag} width={20} />
                {l.name}
                <span className="ml-auto">{selected ? <RiCheckLine size={16} /> : null}</span>
              </Menu.Item>
            );
          })}
        </Menu>
      )}
    </NoSSR>
  );
};
