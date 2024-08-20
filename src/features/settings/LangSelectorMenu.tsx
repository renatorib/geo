import React from "react";

import { RiArrowDownSLine, RiCheckLine } from "react-icons/ri";

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
            <ButtonIcon
              variant="light"
              color="stone"
              radius="sm"
              className="text-sm bg-transparent text-context-500 px-2 transition-colors"
              padding="lg"
            >
              <div className="flex items-center gap-0.5 font-mono">
                {lang.shortCode} <RiArrowDownSLine />
              </div>
            </ButtonIcon>
          }
        >
          <Menu.Title>Language to guess</Menu.Title>
          {Object.values(languages).map((l) => {
            const selected = l.code === lang.code;
            return (
              <Menu.Button key={l.code} onClick={() => setLang(l.code)} selected={selected}>
                <Flag src={l.flag} width={20} />
                {l.name}
                <span className="ml-auto">{selected ? <RiCheckLine size={16} /> : null}</span>
              </Menu.Button>
            );
          })}
        </Menu>
      )}
    </NoSSR>
  );
};
